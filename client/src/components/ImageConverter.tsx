import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Image, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/convert/images-to-pdf", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Conversion successful",
        description: `${files.length} image(s) converted to PDF`,
      });
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Images to PDF</CardTitle>
        <CardDescription>
          Combine multiple images into a single PDF document
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <input
            type="file"
            id="image-input"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            data-testid="input-images"
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById("image-input")?.click()}
            data-testid="button-add-images"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Images
          </Button>
        </div>

        {files.length > 0 && (
          <div className="space-y-2" data-testid="file-list">
            <p className="text-sm font-medium">
              {files.length} image(s) selected
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-md"
                  data-testid={`file-item-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <Image className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    data-testid={`button-remove-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {isConverting && (
          <div className="space-y-2" data-testid="progress-container">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              Converting... {progress}%
            </p>
          </div>
        )}

        <Button
          onClick={handleConvert}
          disabled={files.length === 0 || isConverting}
          className="w-full"
          size="lg"
          data-testid="button-convert"
        >
          {isConverting ? (
            "Converting..."
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Convert to PDF
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
