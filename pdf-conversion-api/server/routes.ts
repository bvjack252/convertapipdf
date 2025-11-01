import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { gotenbergService } from "./services/gotenberg";
import { pdfUtilsService } from "./services/pdfUtils";
import {
  ConversionRequest,
  HtmlToPdfRequest,
  PdfMergeRequest,
  PdfSplitRequest,
  PdfRotateRequest,
  PdfEncryptRequest,
  PdfWatermarkRequest,
  OcrRequest,
  BatchConversionRequest,
} from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Helper function to send file as download
function sendFileDownload(res: Response, buffer: Buffer, fileName: string, contentType: string) {
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Content-Length", buffer.length.toString());
  res.send(buffer);
}

// Helper to get content type from extension
function getContentType(ext: string): string {
  const types: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ppt: "application/vnd.ms-powerpoint",
    odt: "application/vnd.oasis.opendocument.text",
    ods: "application/vnd.oasis.opendocument.spreadsheet",
    odp: "application/vnd.oasis.opendocument.presentation",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    tiff: "image/tiff",
  };
  return types[ext.toLowerCase()] || "application/octet-stream";
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============================================
  // HEALTH CHECK & KEEP-ALIVE
  // ============================================
  
  // Lightweight ping endpoint for keep-alive monitoring
  app.get("/ping", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  // Comprehensive health check
  app.get("/api/health", async (req: Request, res: Response) => {
    try {
      const gotenbergHealthy = await gotenbergService.healthCheck();
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        services: {
          api: "healthy",
          gotenberg: gotenbergHealthy ? "healthy" : "unavailable",
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Health check failed",
      });
    }
  });

  // ============================================
  // OFFICE TO PDF CONVERSIONS
  // ============================================

  // Word to PDF
  app.post("/api/convert/docx-to-pdf", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const options = req.body.options ? JSON.parse(req.body.options) : {};
      const pdfBuffer = await gotenbergService.officeToPdf(req.file.buffer, req.file.originalname, options);
      const fileName = req.file.originalname.replace(/\.(docx?|odt)$/i, ".pdf");
      
      sendFileDownload(res, pdfBuffer, fileName, "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Excel to PDF
  app.post("/api/convert/xlsx-to-pdf", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const options = req.body.options ? JSON.parse(req.body.options) : {};
      const pdfBuffer = await gotenbergService.officeToPdf(req.file.buffer, req.file.originalname, options);
      const fileName = req.file.originalname.replace(/\.(xlsx?|ods)$/i, ".pdf");
      
      sendFileDownload(res, pdfBuffer, fileName, "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // PowerPoint to PDF
  app.post("/api/convert/pptx-to-pdf", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const options = req.body.options ? JSON.parse(req.body.options) : {};
      const pdfBuffer = await gotenbergService.officeToPdf(req.file.buffer, req.file.originalname, options);
      const fileName = req.file.originalname.replace(/\.(pptx?|odp)$/i, ".pdf");
      
      sendFileDownload(res, pdfBuffer, fileName, "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Generic Office to PDF (auto-detect)
  app.post("/api/convert/office-to-pdf", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const options = req.body.options ? JSON.parse(req.body.options) : {};
      const pdfBuffer = await gotenbergService.officeToPdf(req.file.buffer, req.file.originalname, options);
      const fileName = req.file.originalname.replace(/\.(docx?|xlsx?|pptx?|odt|ods|odp)$/i, ".pdf");
      
      sendFileDownload(res, pdfBuffer, fileName, "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============================================
  // WEB TO PDF CONVERSIONS
  // ============================================

  // HTML to PDF
  app.post("/api/convert/html-to-pdf", async (req: Request, res: Response) => {
    try {
      const htmlRequest: HtmlToPdfRequest = req.body;
      
      if (!htmlRequest.html && !htmlRequest.url) {
        return res.status(400).json({ success: false, error: "Either html or url must be provided" });
      }

      const pdfBuffer = await gotenbergService.htmlToPdf(htmlRequest);
      const fileName = "converted.pdf";
      
      sendFileDownload(res, pdfBuffer, fileName, "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // URL to PDF
  app.post("/api/convert/url-to-pdf", async (req: Request, res: Response) => {
    try {
      const { url, options } = req.body;
      
      if (!url) {
        return res.status(400).json({ success: false, error: "URL is required" });
      }

      const htmlRequest: HtmlToPdfRequest = { url, options };
      const pdfBuffer = await gotenbergService.htmlToPdf(htmlRequest);
      const fileName = "webpage.pdf";
      
      sendFileDownload(res, pdfBuffer, fileName, "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Markdown to PDF
  app.post("/api/convert/markdown-to-pdf", async (req: Request, res: Response) => {
    try {
      const { markdown, options } = req.body;
      
      if (!markdown) {
        return res.status(400).json({ success: false, error: "Markdown content is required" });
      }

      const pdfBuffer = await gotenbergService.markdownToPdf(markdown, options);
      const fileName = "document.pdf";
      
      sendFileDownload(res, pdfBuffer, fileName, "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============================================
  // IMAGE CONVERSIONS
  // ============================================

  // Images to PDF
  app.post("/api/convert/images-to-pdf", upload.array("files", 50), async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, error: "No files uploaded" });
      }

      const imageBuffers = files.map(f => f.buffer);
      const pdfBuffer = await pdfUtilsService.imagesToPdf(imageBuffers);
      const fileName = "images.pdf";
      
      sendFileDownload(res, pdfBuffer, fileName, "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============================================
  // PDF UTILITIES
  // ============================================

  // Merge PDFs
  app.post("/api/pdf/merge", upload.array("files", 50), async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length < 2) {
        return res.status(400).json({ success: false, error: "At least 2 PDF files are required" });
      }

      const pdfBuffers = files.map(f => f.buffer);
      const fileNames = files.map(f => f.originalname);
      const mergedPdf = await gotenbergService.mergePdfs(pdfBuffers, fileNames);
      
      sendFileDownload(res, mergedPdf, "merged.pdf", "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Split PDF
  app.post("/api/pdf/split", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const splitRequest: PdfSplitRequest = JSON.parse(req.body.request);
      const splitPdfs = await pdfUtilsService.splitPdf(req.file.buffer, splitRequest);
      
      // For multiple PDFs, we'll return them as a zip file
      if (splitPdfs.length === 1) {
        sendFileDownload(res, splitPdfs[0], "split.pdf", "application/pdf");
      } else {
        // Create zip file with all split PDFs
        const archiver = require("archiver");
        const archive = archiver("zip", { zlib: { level: 9 } });
        
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", 'attachment; filename="split-pdfs.zip"');
        
        archive.pipe(res);
        splitPdfs.forEach((pdf, index) => {
          archive.append(pdf, { name: `part-${index + 1}.pdf` });
        });
        await archive.finalize();
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Rotate PDF
  app.post("/api/pdf/rotate", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const rotateRequest: PdfRotateRequest = JSON.parse(req.body.request);
      const rotatedPdf = await pdfUtilsService.rotatePdf(req.file.buffer, rotateRequest);
      
      sendFileDownload(res, rotatedPdf, "rotated.pdf", "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Compress PDF
  app.post("/api/pdf/compress", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const compressedPdf = await pdfUtilsService.compressPdf(req.file.buffer);
      const fileName = req.file.originalname.replace(".pdf", "-compressed.pdf");
      
      sendFileDownload(res, compressedPdf, fileName, "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Encrypt PDF
  app.post("/api/pdf/encrypt", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const encryptRequest: PdfEncryptRequest = JSON.parse(req.body.request);
      const encryptedPdf = await pdfUtilsService.encryptPdf(req.file.buffer, encryptRequest);
      
      sendFileDownload(res, encryptedPdf, "encrypted.pdf", "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Decrypt PDF
  app.post("/api/pdf/decrypt", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ success: false, error: "Password is required" });
      }

      const decryptedPdf = await pdfUtilsService.decryptPdf(req.file.buffer, password);
      
      sendFileDownload(res, decryptedPdf, "decrypted.pdf", "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Add Watermark
  app.post("/api/pdf/watermark", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const watermarkRequest: PdfWatermarkRequest = JSON.parse(req.body.request);
      const watermarkedPdf = await pdfUtilsService.addWatermark(req.file.buffer, watermarkRequest);
      
      sendFileDownload(res, watermarkedPdf, "watermarked.pdf", "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get PDF Info
  app.post("/api/pdf/info", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const info = await pdfUtilsService.getPdfInfo(req.file.buffer);
      
      res.json({ success: true, info });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Extract Text
  app.post("/api/pdf/extract-text", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const text = await pdfUtilsService.extractText(req.file.buffer);
      
      res.json({ success: true, text });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Convert to PDF/A
  app.post("/api/convert/pdf-to-pdfa", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      const pdfABuffer = await gotenbergService.convertToPdfA(req.file.buffer, req.file.originalname);
      const fileName = req.file.originalname.replace(".pdf", "-pdfa.pdf");
      
      sendFileDownload(res, pdfABuffer, fileName, "application/pdf");
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============================================
  // API INFORMATION
  // ============================================

  app.get("/api/formats", (req: Request, res: Response) => {
    res.json({
      success: true,
      formats: {
        office: {
          word: ["doc", "docx", "odt"],
          excel: ["xls", "xlsx", "ods"],
          powerpoint: ["ppt", "pptx", "odp"],
        },
        images: ["jpg", "jpeg", "png", "webp", "tiff"],
        web: ["html", "markdown"],
        pdf: ["pdf", "pdfa"],
      },
      conversions: {
        "office-to-pdf": "Convert Word, Excel, PowerPoint to PDF",
        "web-to-pdf": "Convert HTML, URLs, Markdown to PDF",
        "images-to-pdf": "Combine images into PDF",
        "pdf-utilities": "Merge, split, compress, rotate, encrypt, watermark PDFs",
      },
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
