import { ConversionRequest, HtmlToPdfRequest, OcrRequest } from "@shared/schema";

// Gotenberg API client
export class GotenbergService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Use environment variable or default to localhost for development
    // In production (Render.com), this will point to the Gotenberg container
    this.baseUrl = baseUrl || process.env.GOTENBERG_URL || "http://localhost:3000";
  }

  /**
   * Convert Office document to PDF
   */
  async officeToPdf(
    fileBuffer: Buffer,
    fileName: string,
    options?: ConversionRequest["options"]
  ): Promise<Buffer> {
    const form = new FormData();
    const blob = new Blob([fileBuffer]);
    form.append("files", blob, fileName);

    // Add options if provided
    if (options?.paperSize) {
      form.append("paperWidth", this.getPaperDimensions(options.paperSize).width);
      form.append("paperHeight", this.getPaperDimensions(options.paperSize).height);
    }
    if (options?.orientation === "landscape") {
      form.append("landscape", "true");
    }
    if (options?.margins) {
      form.append("marginTop", options.margins.top?.toString() || "0");
      form.append("marginBottom", options.margins.bottom?.toString() || "0");
      form.append("marginLeft", options.margins.left?.toString() || "0");
      form.append("marginRight", options.margins.right?.toString() || "0");
    }

    const response = await fetch(`${this.baseUrl}/forms/libreoffice/convert`, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gotenberg conversion failed: ${error}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  /**
   * Convert PDF to Office document (requires PDFtk or similar)
   * Note: This is a simplified version. In reality, PDF to Office conversion
   * is complex and may require additional services or libraries
   */
  async pdfToOffice(
    fileBuffer: Buffer,
    targetFormat: string,
    options?: ConversionRequest["options"]
  ): Promise<Buffer> {
    // For PDF to Office, we'll need to use a different approach
    // Gotenberg doesn't directly support PDF to Office conversion
    // This would typically require additional tools like pdf2docx, etc.
    throw new Error(
      "PDF to Office conversion requires additional processing. " +
      "This will be implemented using specialized libraries."
    );
  }

  /**
   * Convert HTML to PDF
   */
  async htmlToPdf(request: HtmlToPdfRequest): Promise<Buffer> {
    const form = new FormData();

    if (request.html) {
      // Convert HTML content to PDF
      const blob = new Blob([request.html]);
      form.append("files", blob, "index.html");
    } else if (request.url) {
      // Convert URL to PDF
      form.append("url", request.url);
    } else {
      throw new Error("Either html or url must be provided");
    }

    // Add options
    const options = request.options || {};
    if (options.paperSize) {
      const dimensions = this.getPaperDimensions(options.paperSize);
      form.append("paperWidth", dimensions.width);
      form.append("paperHeight", dimensions.height);
    }
    if (options.landscape) {
      form.append("landscape", "true");
    }
    if (options.margins) {
      form.append("marginTop", options.margins.top?.toString() || "0");
      form.append("marginBottom", options.margins.bottom?.toString() || "0");
      form.append("marginLeft", options.margins.left?.toString() || "0");
      form.append("marginRight", options.margins.right?.toString() || "0");
    }
    if (options.scale) {
      form.append("scale", options.scale.toString());
    }

    const endpoint = request.url
      ? `${this.baseUrl}/forms/chromium/convert/url`
      : `${this.baseUrl}/forms/chromium/convert/html`;

    const response = await fetch(endpoint, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gotenberg HTML/URL to PDF conversion failed: ${error}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  /**
   * Convert Markdown to PDF
   */
  async markdownToPdf(
    markdownContent: string,
    options?: HtmlToPdfRequest["options"]
  ): Promise<Buffer> {
    const form = new FormData();
    const blob = new Blob([markdownContent]);
    form.append("files", blob, "index.md");

    // Add options
    if (options?.paperSize) {
      const dimensions = this.getPaperDimensions(options.paperSize);
      form.append("paperWidth", dimensions.width);
      form.append("paperHeight", dimensions.height);
    }
    if (options?.landscape) {
      form.append("landscape", "true");
    }
    if (options?.margins) {
      form.append("marginTop", options.margins.top?.toString() || "0");
      form.append("marginBottom", options.margins.bottom?.toString() || "0");
      form.append("marginLeft", options.margins.left?.toString() || "0");
      form.append("marginRight", options.margins.right?.toString() || "0");
    }

    const response = await fetch(`${this.baseUrl}/forms/chromium/convert/markdown`, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gotenberg Markdown to PDF conversion failed: ${error}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  /**
   * Merge multiple PDFs
   */
  async mergePdfs(pdfBuffers: Buffer[], fileNames: string[]): Promise<Buffer> {
    const form = new FormData();

    pdfBuffers.forEach((buffer, index) => {
      const fileName = fileNames[index] || `file${index + 1}.pdf`;
      const blob = new Blob([buffer]);
      form.append("files", blob, fileName);
    });

    const response = await fetch(`${this.baseUrl}/forms/pdfengines/merge`, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gotenberg PDF merge failed: ${error}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  /**
   * Convert PDF to PDF/A (archival format)
   */
  async convertToPdfA(pdfBuffer: Buffer, fileName: string): Promise<Buffer> {
    const form = new FormData();
    const blob = new Blob([pdfBuffer]);
    form.append("files", blob, fileName);
    form.append("pdfa", "PDF/A-2b");

    const response = await fetch(`${this.baseUrl}/forms/pdfengines/convert`, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gotenberg PDF/A conversion failed: ${error}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  /**
   * Get paper dimensions in inches
   */
  private getPaperDimensions(size: string): { width: string; height: string } {
    const dimensions: Record<string, { width: string; height: string }> = {
      A4: { width: "8.27", height: "11.7" },
      Letter: { width: "8.5", height: "11" },
      Legal: { width: "8.5", height: "14" },
      A3: { width: "11.7", height: "16.5" },
    };
    return dimensions[size] || dimensions.A4;
  }

  /**
   * Check if Gotenberg service is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
      });
      return response.ok;
    } catch (error) {
      console.error("Gotenberg health check failed:", error);
      return false;
    }
  }
}

export const gotenbergService = new GotenbergService();
