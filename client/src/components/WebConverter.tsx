import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Download, Globe, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function WebConverter() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleConvert = async (type: "url" | "html" | "markdown") => {
    let body: any = {};
    let endpoint = "";

    if (type === "url") {
      if (!url) {
        toast({
          title: "URL required",
          description: "Please enter a URL to convert",
          variant: "destructive",
        });
        return;
      }
      body = { url };
      endpoint = "/api/convert/url-to-pdf";
    } else if (type === "html") {
      if (!html) {
        toast({
          title: "HTML required",
          description: "Please enter HTML content to convert",
          variant: "destructive",
        });
        return;
      }
      body = { html };
      endpoint = "/api/convert/html-to-pdf";
    } else if (type === "markdown") {
      if (!markdown) {
        toast({
          title: "Markdown required",
          description: "Please enter Markdown content to convert",
          variant: "destructive",
        });
        return;
      }
      body = { markdown };
      endpoint = "/api/convert/markdown-to-pdf";
    }

    setIsConverting(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = type === "url" ? "webpage.pdf" : "document.pdf";
      a.click();
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Conversion successful",
        description: "Your PDF has been downloaded",
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
        <CardTitle>Web to PDF</CardTitle>
        <CardDescription>
          Convert URLs, HTML, or Markdown to PDF documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="url" data-testid="tab-url">
              <Globe className="w-4 h-4 mr-2" />
              URL
            </TabsTrigger>
            <TabsTrigger value="html" data-testid="tab-html">
              <Code className="w-4 h-4 mr-2" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="markdown" data-testid="tab-markdown">
              <Code className="w-4 h-4 mr-2" />
              Markdown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Website URL</label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                data-testid="input-url"
              />
            </div>
            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  Converting... {progress}%
                </p>
              </div>
            )}
            <Button
              onClick={() => handleConvert("url")}
              disabled={!url || isConverting}
              className="w-full"
              size="lg"
              data-testid="button-convert-url"
            >
              <Download className="w-4 h-4 mr-2" />
              Convert URL to PDF
            </Button>
          </TabsContent>

          <TabsContent value="html" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">HTML Content</label>
              <Textarea
                placeholder="<h1>Hello World</h1>"
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                rows={10}
                className="font-mono text-sm"
                data-testid="input-html"
              />
            </div>
            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  Converting... {progress}%
                </p>
              </div>
            )}
            <Button
              onClick={() => handleConvert("html")}
              disabled={!html || isConverting}
              className="w-full"
              size="lg"
              data-testid="button-convert-html"
            >
              <Download className="w-4 h-4 mr-2" />
              Convert HTML to PDF
            </Button>
          </TabsContent>

          <TabsContent value="markdown" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Markdown Content</label>
              <Textarea
                placeholder="# Hello World"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                rows={10}
                className="font-mono text-sm"
                data-testid="input-markdown"
              />
            </div>
            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  Converting... {progress}%
                </p>
              </div>
            )}
            <Button
              onClick={() => handleConvert("markdown")}
              disabled={!markdown || isConverting}
              className="w-full"
              size="lg"
              data-testid="button-convert-markdown"
            >
              <Download className="w-4 h-4 mr-2" />
              Convert Markdown to PDF
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
