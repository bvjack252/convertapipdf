import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/FileUpload";
import { Progress } from "@/components/ui/progress";
import { Download, Merge, Split, RotateCw, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PdfUtilities() {
  const [files, setFiles] = useState<File[]>([]);
  const [utility, setUtility] = useState<string>("merge");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const utilities = [
    { value: "merge", label: "Merge PDFs", icon: Merge, multiple: true },
    { value: "compress", label: "Compress PDF", icon: Download, multiple: false },
    { value: "rotate", label: "Rotate PDF", icon: RotateCw, multiple: false },
  ];

  const currentUtility = utilities.find((u) => u.value === utility);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      if (currentUtility?.multiple) {
        setFiles((prev) => [...prev, file]);
      } else {
        setFiles([file]);
      }
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one PDF file",
        variant: "destructive",
      });
      return;
    }

    if (utility === "merge" && files.length < 2) {
      toast({
        title: "Multiple files required",
        description: "Please select at least 2 PDF files to merge",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const endpoint = utility === "merge" ? "/api/pdf/merge" : `/api/pdf/${utility}`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error("Processing failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = utility === "merge" ? "merged.pdf" : `${utility}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `PDF ${utility} completed`,
      });

      setFiles([]);
    } catch (error) {
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Utilities</CardTitle>
        <CardDescription>
          Merge, compress, rotate, and manage your PDF files
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Utility Type</label>
          <Select value={utility} onValueChange={(value) => { setUtility(value); setFiles([]); }}>
            <SelectTrigger data-testid="select-utility">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {utilities.map((util) => (
                <SelectItem key={util.value} value={util.value} data-testid={`option-${util.value}`}>
                  <div className="flex items-center gap-2">
                    <util.icon className="w-4 h-4" />
                    {util.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FileUpload
          onFileSelect={handleFileSelect}
          accept=".pdf"
          maxSize={100 * 1024 * 1024}
        />

        {files.length > 0 && (
          <div className="space-y-2" data-testid="file-list">
            <p className="text-sm font-medium">
              {files.length} PDF(s) selected
            </p>
            {files.map((file, index) => (
              <div key={index} className="p-3 border rounded-md">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ))}
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2" data-testid="progress-container">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              Processing... {progress}%
            </p>
          </div>
        )}

        <Button
          onClick={handleProcess}
          disabled={files.length === 0 || isProcessing}
          className="w-full"
          size="lg"
          data-testid="button-process"
        >
          {isProcessing ? (
            "Processing..."
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              {currentUtility?.label}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
