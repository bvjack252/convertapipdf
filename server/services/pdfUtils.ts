import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import sharp from "sharp";
import {
  PdfSplitRequest,
  PdfRotateRequest,
  PdfEncryptRequest,
  PdfWatermarkRequest,
  PdfInfoResponse,
} from "@shared/schema";

/**
 * PDF utility service for operations like split, rotate, encrypt, watermark
 * Uses pdf-lib for PDF manipulation
 */
export class PdfUtilsService {
  /**
   * Split PDF into multiple files based on page ranges
   */
  async splitPdf(
    pdfBuffer: Buffer,
    request: PdfSplitRequest
  ): Promise<Buffer[]> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const results: Buffer[] = [];

    for (const range of request.pageRanges) {
      const newPdf = await PDFDocument.create();
      const pageIndices = this.parsePageRange(range, pdfDoc.getPageCount());

      for (const pageIndex of pageIndices) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();
      results.push(Buffer.from(pdfBytes));
    }

    return results;
  }

  /**
   * Rotate PDF pages
   */
  async rotatePdf(
    pdfBuffer: Buffer,
    request: PdfRotateRequest
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const rotation = parseInt(request.angle);
    
    const pageIndices = request.pages === "all" || !request.pages
      ? Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i)
      : this.parsePageRange(request.pages, pdfDoc.getPageCount());

    for (const pageIndex of pageIndices) {
      const page = pdfDoc.getPage(pageIndex);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotation));
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  /**
   * Encrypt PDF with password
   */
  async encryptPdf(
    pdfBuffer: Buffer,
    request: PdfEncryptRequest
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Set passwords and permissions
    const pdfBytes = await pdfDoc.save({
      userPassword: request.userPassword,
      ownerPassword: request.ownerPassword || request.userPassword,
      permissions: {
        printing: request.permissions?.print !== false ? 'highResolution' : 'notAllowed',
        copying: request.permissions?.copy !== false,
        modifying: request.permissions?.modify !== false,
        annotating: true,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: true,
      },
    });

    return Buffer.from(pdfBytes);
  }

  /**
   * Decrypt PDF (remove password)
   */
  async decryptPdf(pdfBuffer: Buffer, password: string): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(pdfBuffer, { password });
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  /**
   * Add watermark to PDF
   */
  async addWatermark(
    pdfBuffer: Buffer,
    request: PdfWatermarkRequest
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const fontSize = request.options?.fontSize || 48;
    const opacity = request.options?.opacity || 0.3;
    const rotation = request.options?.rotation || -45;

    for (const page of pages) {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(request.text, fontSize);
      const textHeight = fontSize;

      // Calculate position based on option
      let x = width / 2 - textWidth / 2;
      let y = height / 2 - textHeight / 2;

      if (request.options?.position === "top") {
        y = height - textHeight - 50;
      } else if (request.options?.position === "bottom") {
        y = 50;
      }

      page.drawText(request.text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity,
        rotate: degrees(rotation),
      });
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  /**
   * Compress PDF by reducing image quality
   */
  async compressPdf(pdfBuffer: Buffer): Promise<Buffer> {
    // Basic compression using pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });
    return Buffer.from(pdfBytes);
  }

  /**
   * Extract PDF metadata and information
   */
  async getPdfInfo(pdfBuffer: Buffer): Promise<PdfInfoResponse["info"]> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    return {
      pages: pdfDoc.getPageCount(),
      pageSize: `${Math.round(width)} x ${Math.round(height)} pts`,
      fileSize: pdfBuffer.length,
      title: pdfDoc.getTitle() || undefined,
      author: pdfDoc.getAuthor() || undefined,
      subject: pdfDoc.getSubject() || undefined,
      keywords: pdfDoc.getKeywords() || undefined,
      creator: pdfDoc.getCreator() || undefined,
      producer: pdfDoc.getProducer() || undefined,
      creationDate: pdfDoc.getCreationDate()?.toISOString() || undefined,
      modificationDate: pdfDoc.getModificationDate()?.toISOString() || undefined,
    };
  }

  /**
   * Extract text from PDF
   */
  async extractText(pdfBuffer: Buffer): Promise<string> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    // Note: pdf-lib doesn't have built-in text extraction
    // For production, you'd use pdf-parse or similar library
    return "Text extraction requires pdf-parse library (not included in basic implementation)";
  }

  /**
   * Convert PDF pages to images
   */
  async pdfToImages(
    pdfBuffer: Buffer,
    format: "png" | "jpg" = "png",
    dpi: number = 150
  ): Promise<Buffer[]> {
    // This requires pdf-to-image library or similar
    // Placeholder implementation
    throw new Error("PDF to image conversion requires additional libraries (e.g., pdf-poppler)");
  }

  /**
   * Convert images to PDF
   */
  async imagesToPdf(imageBuffers: Buffer[]): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();

    for (const imageBuffer of imageBuffers) {
      // Detect image format
      const metadata = await sharp(imageBuffer).metadata();
      let image;

      if (metadata.format === "png") {
        image = await pdfDoc.embedPng(imageBuffer);
      } else if (metadata.format === "jpeg" || metadata.format === "jpg") {
        image = await pdfDoc.embedJpg(imageBuffer);
      } else {
        // Convert to PNG first
        const pngBuffer = await sharp(imageBuffer).png().toBuffer();
        image = await pdfDoc.embedPng(pngBuffer);
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  /**
   * Parse page range string (e.g., "1-5,7,9-11") into array of page indices
   */
  private parsePageRange(range: string, totalPages: number): number[] {
    const indices: number[] = [];
    const parts = range.split(",");

    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((n) => parseInt(n.trim()));
        for (let i = start; i <= end && i <= totalPages; i++) {
          indices.push(i - 1); // Convert to 0-indexed
        }
      } else {
        const pageNum = parseInt(part.trim());
        if (pageNum <= totalPages) {
          indices.push(pageNum - 1); // Convert to 0-indexed
        }
      }
    }

    return indices;
  }
}

export const pdfUtilsService = new PdfUtilsService();
