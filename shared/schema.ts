import { z } from "zod";

// Supported conversion formats
export const ConversionFormat = {
  // PDF formats
  PDF: "pdf",
  
  // Microsoft Office formats
  DOCX: "docx",
  DOC: "doc",
  XLSX: "xlsx",
  XLS: "xls",
  PPTX: "pptx",
  PPT: "ppt",
  
  // OpenOffice formats
  ODT: "odt",
  ODS: "ods",
  ODP: "odp",
  
  // Image formats
  JPG: "jpg",
  JPEG: "jpeg",
  PNG: "png",
  WEBP: "webp",
  TIFF: "tiff",
  
  // Web formats
  HTML: "html",
  MARKDOWN: "md",
  
  // Archive format
  PDFA: "pdfa",
} as const;

export type ConversionFormatType = typeof ConversionFormat[keyof typeof ConversionFormat];

// Conversion request schema
export const conversionRequestSchema = z.object({
  sourceFormat: z.string(),
  targetFormat: z.string(),
  options: z.object({
    quality: z.enum(["high", "medium", "low"]).optional(),
    pageRange: z.string().optional(), // e.g., "1-5" or "1,3,5"
    orientation: z.enum(["portrait", "landscape"]).optional(),
    paperSize: z.enum(["A4", "Letter", "Legal", "A3"]).optional(),
    margins: z.object({
      top: z.number().optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
    }).optional(),
    compress: z.boolean().optional(),
    ocr: z.boolean().optional(),
    
    // Advanced Office to PDF options (Gotenberg LibreOffice)
    losslessImageCompression: z.boolean().optional(),
    imageQuality: z.number().min(1).max(100).optional(), // JPEG quality 1-100
    reduceImageResolution: z.boolean().optional(),
    maxImageResolution: z.enum(["75", "150", "300", "600", "1200"]).optional(), // DPI
    singlePageSheets: z.boolean().optional(), // Excel: fit each sheet on one page
    exportFormFields: z.boolean().optional(), // Export PDF form fields
    nativePageRanges: z.string().optional(), // LibreOffice page ranges
  }).optional(),
});

export type ConversionRequest = z.infer<typeof conversionRequestSchema>;

// PDF merge request
export const pdfMergeRequestSchema = z.object({
  files: z.array(z.string()), // file paths or base64
  options: z.object({
    compress: z.boolean().optional(),
  }).optional(),
});

export type PdfMergeRequest = z.infer<typeof pdfMergeRequestSchema>;

// PDF split request
export const pdfSplitRequestSchema = z.object({
  pageRanges: z.array(z.string()), // e.g., ["1-5", "6-10"]
  options: z.object({
    compress: z.boolean().optional(),
  }).optional(),
});

export type PdfSplitRequest = z.infer<typeof pdfSplitRequestSchema>;

// PDF rotate request
export const pdfRotateRequestSchema = z.object({
  angle: z.enum(["90", "180", "270"]),
  pages: z.string().optional(), // e.g., "1-5" or "all"
});

export type PdfRotateRequest = z.infer<typeof pdfRotateRequestSchema>;

// PDF encrypt request
export const pdfEncryptRequestSchema = z.object({
  userPassword: z.string(),
  ownerPassword: z.string().optional(),
  permissions: z.object({
    print: z.boolean().optional(),
    copy: z.boolean().optional(),
    modify: z.boolean().optional(),
  }).optional(),
});

export type PdfEncryptRequest = z.infer<typeof pdfEncryptRequestSchema>;

// PDF watermark request
export const pdfWatermarkRequestSchema = z.object({
  text: z.string(),
  options: z.object({
    opacity: z.number().min(0).max(1).optional(),
    fontSize: z.number().optional(),
    rotation: z.number().optional(),
    position: z.enum(["center", "top", "bottom", "diagonal"]).optional(),
  }).optional(),
});

export type PdfWatermarkRequest = z.infer<typeof pdfWatermarkRequestSchema>;

// HTML to PDF request
export const htmlToPdfRequestSchema = z.object({
  html: z.string().optional(),
  url: z.string().optional(),
  options: z.object({
    paperSize: z.enum(["A4", "Letter", "Legal", "A3"]).optional(),
    margins: z.object({
      top: z.number().optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
    }).optional(),
    landscape: z.boolean().optional(),
    scale: z.number().optional(),
  }).optional(),
});

export type HtmlToPdfRequest = z.infer<typeof htmlToPdfRequestSchema>;

// Batch conversion request
export const batchConversionRequestSchema = z.object({
  conversions: z.array(z.object({
    sourceFormat: z.string(),
    targetFormat: z.string(),
    fileName: z.string(),
  })),
  options: conversionRequestSchema.shape.options.optional(),
});

export type BatchConversionRequest = z.infer<typeof batchConversionRequestSchema>;

// OCR request
export const ocrRequestSchema = z.object({
  language: z.string().optional().default("eng"),
  outputFormat: z.enum(["text", "pdf", "hocr"]).optional().default("text"),
});

export type OcrRequest = z.infer<typeof ocrRequestSchema>;

// Conversion job status
export const ConversionStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type ConversionStatusType = typeof ConversionStatus[keyof typeof ConversionStatus];

// Conversion job (for tracking)
export const conversionJobSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  sourceFormat: z.string(),
  targetFormat: z.string(),
  fileName: z.string(),
  fileSize: z.number().optional(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
  error: z.string().optional(),
  downloadUrl: z.string().optional(),
});

export type ConversionJob = z.infer<typeof conversionJobSchema>;
export type InsertConversionJob = Omit<ConversionJob, "id" | "createdAt">;

// API response types
export interface ConversionResponse {
  success: boolean;
  message?: string;
  downloadUrl?: string;
  fileName?: string;
  error?: string;
}

export interface BatchConversionResponse {
  success: boolean;
  results: ConversionResponse[];
  totalFiles: number;
  successCount: number;
  failureCount: number;
}

export interface PdfInfoResponse {
  success: boolean;
  info?: {
    pages: number;
    pageSize: string;
    fileSize: number;
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    modificationDate?: string;
  };
  error?: string;
}

export interface OcrResponse {
  success: boolean;
  text?: string;
  downloadUrl?: string;
  error?: string;
}
