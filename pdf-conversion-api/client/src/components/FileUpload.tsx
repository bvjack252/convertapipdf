import { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = "*",
  maxSize = 100 * 1024 * 1024,
  multiple = false,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndSelectFile = (file: File) => {
    setError(null);

    if (file.size > maxSize) {
      setError(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        validateAndSelectFile(files[0]);
      }
    },
    [maxSize, onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover-elevate"
        )}
        onClick={() => document.getElementById("file-input")?.click()}
        data-testid="dropzone-upload"
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          data-testid="input-file"
        />
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="font-medium mb-1">Drop your file here</p>
        <p className="text-sm text-muted-foreground">
          or click to browse files
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive" data-testid="text-error">
          {error}
        </p>
      )}
    </div>
  );
}
