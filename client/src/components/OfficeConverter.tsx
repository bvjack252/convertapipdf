import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/FileUpload";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function OfficeConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<string>("docx-to-pdf");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const conversionOptions = [
    { value: "docx-to-pdf", label: "Word → PDF", icon: FileText },
    { value: "xlsx-to-pdf", label: "Excel → PDF", icon: FileSpreadsheet },
    { value: "pptx-to-pdf", label: "PowerPoint → PDF", icon: File },
    { value: "office-to-pdf", label: "Auto-detect → PDF", icon: FileText },
  ];

  const handleConvert = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to convert",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(`/api/convert/${conversionType}`, {
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
      a.download = file.name.replace(/\.[^/.]+$/, ".pdf");
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Conversion successful",
        description: "Your file has been converted and downloaded",
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
        <CardTitle>Office Document Conversion</CardTitle>
        <CardDescription>
          Convert Word, Excel, and PowerPoint files to PDF with professional quality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Conversion Type</label>
          <Select value={conversionType} onValueChange={setConversionType}>
            <SelectTrigger data-testid="select-conversion-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {conversionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} data-testid={`option-${option.value}`}>
                  <div className="flex items-center gap-2">
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FileUpload
          onFileSelect={setFile}
          accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp"
          maxSize={100 * 1024 * 1024}
        />

        {file && (
          <div className="p-4 border rounded-md" data-testid="file-info">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" data-testid="text-filename">{file.name}</p>
                <p className="text-sm text-muted-foreground" data-testid="text-filesize">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
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
          disabled={!file || isConverting}
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
