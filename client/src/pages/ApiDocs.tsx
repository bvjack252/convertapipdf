import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ApiDocs() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet copied successfully",
    });
  };

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2"
      onClick={() => copyToClipboard(text, id)}
      data-testid={`button-copy-${id}`}
    >
      {copiedId === id ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Converter
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">
            API Documentation
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-page-description">
            Complete REST API reference for document conversion
          </p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>
                All endpoints accept multipart/form-data for file uploads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Base URL</p>
                <code className="block p-3 bg-muted rounded-md text-sm font-mono">
                  {window.location.origin}/api
                </code>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Rate Limits</p>
                <p className="text-sm text-muted-foreground">
                  Free tier: 100MB max file size, 2-minute timeout per request
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Office Conversions */}
          <Card>
            <CardHeader>
              <CardTitle>Office to PDF</CardTitle>
              <CardDescription>
                Convert Word, Excel, PowerPoint documents to PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="curl">
                <TabsList className="mb-4">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>

                <TabsContent value="curl" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`curl -X POST ${window.location.origin}/api/convert/docx-to-pdf \\
  -F "file=@document.docx" \\
  -o output.pdf`}
                  </pre>
                  <CopyButton
                    id="office-curl"
                    text={`curl -X POST ${window.location.origin}/api/convert/docx-to-pdf -F "file=@document.docx" -o output.pdf`}
                  />
                </TabsContent>

                <TabsContent value="javascript" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('${window.location.origin}/api/convert/docx-to-pdf', {
  method: 'POST',
  body: formData
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
window.open(url);`}
                  </pre>
                  <CopyButton
                    id="office-js"
                    text={`const formData = new FormData();\nformData.append('file', fileInput.files[0]);\n\nconst response = await fetch('${window.location.origin}/api/convert/docx-to-pdf', {\n  method: 'POST',\n  body: formData\n});\n\nconst blob = await response.blob();\nconst url = URL.createObjectURL(blob);\nwindow.open(url);`}
                  />
                </TabsContent>

                <TabsContent value="python" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`import requests

files = {'file': open('document.docx', 'rb')}
response = requests.post(
    '${window.location.origin}/api/convert/docx-to-pdf',
    files=files
)

with open('output.pdf', 'wb') as f:
    f.write(response.content)`}
                  </pre>
                  <CopyButton
                    id="office-python"
                    text={`import requests\n\nfiles = {'file': open('document.docx', 'rb')}\nresponse = requests.post(\n    '${window.location.origin}/api/convert/docx-to-pdf',\n    files=files\n)\n\nwith open('output.pdf', 'wb') as f:\n    f.write(response.content)`}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Endpoints List */}
          <Card>
            <CardHeader>
              <CardTitle>All Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Office Conversions</h3>
                  <div className="space-y-1 text-sm font-mono">
                    <p>POST /api/convert/docx-to-pdf</p>
                    <p>POST /api/convert/xlsx-to-pdf</p>
                    <p>POST /api/convert/pptx-to-pdf</p>
                    <p>POST /api/convert/office-to-pdf</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Web to PDF</h3>
                  <div className="space-y-1 text-sm font-mono">
                    <p>POST /api/convert/html-to-pdf</p>
                    <p>POST /api/convert/url-to-pdf</p>
                    <p>POST /api/convert/markdown-to-pdf</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Image Conversions</h3>
                  <div className="space-y-1 text-sm font-mono">
                    <p>POST /api/convert/images-to-pdf</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">PDF Utilities</h3>
                  <div className="space-y-1 text-sm font-mono">
                    <p>POST /api/pdf/merge</p>
                    <p>POST /api/pdf/split</p>
                    <p>POST /api/pdf/rotate</p>
                    <p>POST /api/pdf/compress</p>
                    <p>POST /api/pdf/encrypt</p>
                    <p>POST /api/pdf/decrypt</p>
                    <p>POST /api/pdf/watermark</p>
                    <p>POST /api/pdf/info</p>
                    <p>POST /api/pdf/extract-text</p>
                    <p>POST /api/convert/pdf-to-pdfa</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Information</h3>
                  <div className="space-y-1 text-sm font-mono">
                    <p>GET /api/health</p>
                    <p>GET /api/formats</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Web to PDF Example */}
          <Card>
            <CardHeader>
              <CardTitle>HTML/URL to PDF</CardTitle>
              <CardDescription>
                Convert web content to PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="curl">
                <TabsList className="mb-4">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="curl" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`# URL to PDF
curl -X POST ${window.location.origin}/api/convert/url-to-pdf \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}' \\
  -o webpage.pdf

# HTML to PDF
curl -X POST ${window.location.origin}/api/convert/html-to-pdf \\
  -H "Content-Type: application/json" \\
  -d '{"html": "<h1>Hello World</h1>"}' \\
  -o output.pdf`}
                  </pre>
                  <CopyButton
                    id="web-curl"
                    text={`curl -X POST ${window.location.origin}/api/convert/url-to-pdf -H "Content-Type: application/json" -d '{"url": "https://example.com"}' -o webpage.pdf`}
                  />
                </TabsContent>

                <TabsContent value="javascript" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`const response = await fetch('${window.location.origin}/api/convert/url-to-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com' })
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
window.open(url);`}
                  </pre>
                  <CopyButton
                    id="web-js"
                    text={`const response = await fetch('${window.location.origin}/api/convert/url-to-pdf', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ url: 'https://example.com' })\n});\n\nconst blob = await response.blob();\nconst url = URL.createObjectURL(blob);\nwindow.open(url);`}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
