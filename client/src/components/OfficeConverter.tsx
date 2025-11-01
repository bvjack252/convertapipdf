import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/FileUpload";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, FileSpreadsheet, File, Settings2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConversionOptions {
  paperSize?: string;
  orientation?: string;
  imageQuality?: number;
  losslessImageCompression?: boolean;
  reduceImageResolution?: boolean;
  maxImageResolution?: string;
  singlePageSheets?: boolean;
  exportFormFields?: boolean;
  nativePageRanges?: string;
}

export function OfficeConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<string>("docx-to-pdf");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  const [options, setOptions] = useState<ConversionOptions>({
    paperSize: "A4",
    orientation: "portrait",
    imageQuality: 90,
    losslessImageCompression: true,
    reduceImageResolution: false,
    maxImageResolution: "300",
    singlePageSheets: false,
    exportFormFields: true,
    nativePageRanges: "",
  });

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
    
    const cleanedOptions: Partial<ConversionOptions> = {
      paperSize: options.paperSize,
      orientation: options.orientation,
      losslessImageCompression: options.losslessImageCompression,
      exportFormFields: options.exportFormFields,
    };
    
    if (!options.losslessImageCompression) {
      cleanedOptions.imageQuality = options.imageQuality;
    }
    
    if (options.reduceImageResolution) {
      cleanedOptions.reduceImageResolution = true;
      cleanedOptions.maxImageResolution = options.maxImageResolution;
    }
    
    if (isExcel && options.singlePageSheets) {
      cleanedOptions.singlePageSheets = true;
    }
    
    if (options.nativePageRanges?.trim()) {
      cleanedOptions.nativePageRanges = options.nativePageRanges.trim();
    }
    
    formData.append("options", JSON.stringify(cleanedOptions));

    try {
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

  const isExcel = conversionType === "xlsx-to-pdf" || (conversionType === "office-to-pdf" && file?.name.match(/\.(xlsx?|ods)$/i));

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

        <TooltipProvider>
          <Accordion type="single" collapsible className="border rounded-md">
            <AccordionItem value="advanced" className="border-none">
              <AccordionTrigger className="px-4 hover:no-underline" data-testid="accordion-advanced-options">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  <span>Advanced Options</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-6">
                
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Page Settings</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paper-size">Paper Size</Label>
                      <Select 
                        value={options.paperSize} 
                        onValueChange={(value) => setOptions({...options, paperSize: value})}
                      >
                        <SelectTrigger id="paper-size" data-testid="select-paper-size">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A4" data-testid="option-paper-A4">A4</SelectItem>
                          <SelectItem value="Letter" data-testid="option-paper-Letter">Letter</SelectItem>
                          <SelectItem value="Legal" data-testid="option-paper-Legal">Legal</SelectItem>
                          <SelectItem value="A3" data-testid="option-paper-A3">A3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orientation">Orientation</Label>
                      <Select 
                        value={options.orientation} 
                        onValueChange={(value) => setOptions({...options, orientation: value})}
                      >
                        <SelectTrigger id="orientation" data-testid="select-orientation">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait" data-testid="option-orientation-portrait">Portrait</SelectItem>
                          <SelectItem value="landscape" data-testid="option-orientation-landscape">Landscape</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="page-range">Page Range</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">Examples: "1-5" for pages 1 to 5, "1,3,5" for specific pages, or leave empty for all pages</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="page-range"
                      placeholder="e.g., 1-5 or 1,3,5 (optional)"
                      value={options.nativePageRanges || ""}
                      onChange={(e) => setOptions({...options, nativePageRanges: e.target.value})}
                      data-testid="input-page-range"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-sm">Image Quality</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="lossless">Lossless Compression</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">Keep original image quality without compression. Disable for smaller file sizes.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Switch
                        id="lossless"
                        checked={options.losslessImageCompression}
                        onCheckedChange={(checked) => setOptions({...options, losslessImageCompression: checked})}
                        data-testid="switch-lossless-compression"
                      />
                    </div>

                    {!options.losslessImageCompression && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Image Quality: {options.imageQuality}%</Label>
                        </div>
                        <Slider
                          value={[options.imageQuality || 90]}
                          onValueChange={([value]) => setOptions({...options, imageQuality: value})}
                          min={1}
                          max={100}
                          step={1}
                          data-testid="slider-image-quality"
                        />
                        <p className="text-xs text-muted-foreground">Lower values = smaller file size, lower quality</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="reduce-resolution">Reduce Image Resolution</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">Reduce image DPI to decrease file size. Images will appear smaller but maintain clarity.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Switch
                        id="reduce-resolution"
                        checked={options.reduceImageResolution}
                        onCheckedChange={(checked) => setOptions({...options, reduceImageResolution: checked})}
                        data-testid="switch-reduce-resolution"
                      />
                    </div>

                    {options.reduceImageResolution && (
                      <div className="space-y-2">
                        <Label htmlFor="max-resolution">Maximum DPI</Label>
                        <Select 
                          value={options.maxImageResolution} 
                          onValueChange={(value) => setOptions({...options, maxImageResolution: value})}
                        >
                          <SelectTrigger id="max-resolution" data-testid="select-max-resolution">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="75" data-testid="option-dpi-75">75 DPI (Smallest)</SelectItem>
                            <SelectItem value="150" data-testid="option-dpi-150">150 DPI (Small)</SelectItem>
                            <SelectItem value="300" data-testid="option-dpi-300">300 DPI (Balanced)</SelectItem>
                            <SelectItem value="600" data-testid="option-dpi-600">600 DPI (High)</SelectItem>
                            <SelectItem value="1200" data-testid="option-dpi-1200">1200 DPI (Highest)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                {isExcel && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium text-sm">Excel Options</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="single-page">Fit Each Sheet on One Page</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">Scales each Excel sheet to fit on a single PDF page. Prevents empty pages and column cutoffs.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Switch
                        id="single-page"
                        checked={options.singlePageSheets}
                        onCheckedChange={(checked) => setOptions({...options, singlePageSheets: checked})}
                        data-testid="switch-single-page-sheets"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-sm">Other Options</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="form-fields">Export Form Fields</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">Include interactive form fields in the PDF output.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch
                      id="form-fields"
                      checked={options.exportFormFields}
                      onCheckedChange={(checked) => setOptions({...options, exportFormFields: checked})}
                      data-testid="switch-export-form-fields"
                    />
                  </div>
                </div>

              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TooltipProvider>

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
