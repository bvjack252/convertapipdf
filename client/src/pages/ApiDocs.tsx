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
                  https://convertapipdf.onrender.com/api
                </code>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Local Development</p>
                <code className="block p-3 bg-muted rounded-md text-sm font-mono">
                  http://localhost:5000/api
                </code>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Rate Limits</p>
                <p className="text-sm text-muted-foreground">
                  Free tier: 100MB max file size, 2-minute timeout per request
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Supported Formats</p>
                <p className="text-sm text-muted-foreground">
                  Office: DOCX, DOC, XLSX, XLS, PPTX, PPT, ODT, ODS, ODP • Images: JPG, PNG, WEBP, TIFF • Web: HTML, URL, Markdown
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Office Conversions */}
          <Card>
            <CardHeader>
              <CardTitle>Office to PDF</CardTitle>
              <CardDescription>
                Convert Word, Excel, PowerPoint documents to PDF with advanced options
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
                    {`# Basic conversion
curl -X POST https://convertapipdf.onrender.com/api/convert/docx-to-pdf \\
  -F "file=@document.docx" \\
  -o output.pdf

# With advanced options
curl -X POST https://convertapipdf.onrender.com/api/convert/xlsx-to-pdf \\
  -F "file=@spreadsheet.xlsx" \\
  -F 'options={"paperSize":"A4","orientation":"landscape","imageQuality":85,"losslessImageCompression":false,"singlePageSheets":true}' \\
  -o output.pdf`}
                  </pre>
                  <CopyButton
                    id="office-curl"
                    text={`curl -X POST https://convertapipdf.onrender.com/api/convert/docx-to-pdf -F "file=@document.docx" -o output.pdf`}
                  />
                </TabsContent>

                <TabsContent value="javascript" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`const formData = new FormData();
formData.append('file', fileInput.files[0]);

// Advanced options (optional)
const options = {
  paperSize: "A4",
  orientation: "portrait",
  imageQuality: 90,
  losslessImageCompression: true,
  singlePageSheets: true,  // Excel only
  nativePageRanges: "1-5"  // Specific pages
};
formData.append('options', JSON.stringify(options));

const response = await fetch('https://convertapipdf.onrender.com/api/convert/docx-to-pdf', {
  method: 'POST',
  body: formData
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
window.open(url);`}
                  </pre>
                  <CopyButton
                    id="office-js"
                    text={`const formData = new FormData();\nformData.append('file', fileInput.files[0]);\n\nconst response = await fetch('https://convertapipdf.onrender.com/api/convert/docx-to-pdf', {\n  method: 'POST',\n  body: formData\n});\n\nconst blob = await response.blob();\nconst url = URL.createObjectURL(blob);\nwindow.open(url);`}
                  />
                </TabsContent>

                <TabsContent value="python" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`import requests
import json

files = {'file': open('document.docx', 'rb')}

# Advanced options (optional)
options = {
    "paperSize": "A4",
    "orientation": "portrait",
    "imageQuality": 90,
    "losslessImageCompression": True,
    "reduceImageResolution": False,
    "maxImageResolution": "300"
}

data = {'options': json.dumps(options)}

response = requests.post(
    'https://convertapipdf.onrender.com/api/convert/docx-to-pdf',
    files=files,
    data=data
)

with open('output.pdf', 'wb') as f:
    f.write(response.content)`}
                  </pre>
                  <CopyButton
                    id="office-python"
                    text={`import requests\n\nfiles = {'file': open('document.docx', 'rb')}\nresponse = requests.post(\n    'https://convertapipdf.onrender.com/api/convert/docx-to-pdf',\n    files=files\n)\n\nwith open('output.pdf', 'wb') as f:\n    f.write(response.content)`}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 p-4 bg-muted rounded-md space-y-3">
                <p className="font-semibold text-sm">Advanced Options (All Optional)</p>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <p className="font-semibold text-foreground mb-1">Page Settings:</p>
                    <p>paperSize: "A4" | "Letter" | "Legal" | "A3"</p>
                    <p>orientation: "portrait" | "landscape"</p>
                    <p>nativePageRanges: "1-5" or "1,3,5"</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Image Quality:</p>
                    <p>losslessImageCompression: boolean</p>
                    <p>imageQuality: 1-100 (JPEG quality)</p>
                    <p>reduceImageResolution: boolean</p>
                    <p>maxImageResolution: "75"|"150"|"300"|"600"|"1200"</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Excel Options:</p>
                    <p>singlePageSheets: boolean</p>
                    <p className="text-muted-foreground">(Fits each sheet on one page)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Other:</p>
                    <p>exportFormFields: boolean</p>
                    <p className="text-muted-foreground">(Include PDF form fields)</p>
                  </div>
                </div>
              </div>
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
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>

                <TabsContent value="curl" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`# URL to PDF
curl -X POST https://convertapipdf.onrender.com/api/convert/url-to-pdf \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}' \\
  -o webpage.pdf

# HTML to PDF
curl -X POST https://convertapipdf.onrender.com/api/convert/html-to-pdf \\
  -H "Content-Type: application/json" \\
  -d '{"html": "<h1>Hello World</h1>"}' \\
  -o output.pdf

# Markdown to PDF
curl -X POST https://convertapipdf.onrender.com/api/convert/markdown-to-pdf \\
  -F "file=@README.md" \\
  -o output.pdf`}
                  </pre>
                  <CopyButton
                    id="web-curl"
                    text={`curl -X POST https://convertapipdf.onrender.com/api/convert/url-to-pdf -H "Content-Type: application/json" -d '{"url": "https://example.com"}' -o webpage.pdf`}
                  />
                </TabsContent>

                <TabsContent value="javascript" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`const response = await fetch('https://convertapipdf.onrender.com/api/convert/url-to-pdf', {
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
                    text={`const response = await fetch('https://convertapipdf.onrender.com/api/convert/url-to-pdf', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ url: 'https://example.com' })\n});\n\nconst blob = await response.blob();\nconst url = URL.createObjectURL(blob);\nwindow.open(url);`}
                  />
                </TabsContent>

                <TabsContent value="python" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`import requests

# URL to PDF
response = requests.post(
    'https://convertapipdf.onrender.com/api/convert/url-to-pdf',
    json={'url': 'https://example.com'}
)

with open('webpage.pdf', 'wb') as f:
    f.write(response.content)`}
                  </pre>
                  <CopyButton
                    id="web-python"
                    text={`import requests\n\nresponse = requests.post(\n    'https://convertapipdf.onrender.com/api/convert/url-to-pdf',\n    json={'url': 'https://example.com'}\n)\n\nwith open('webpage.pdf', 'wb') as f:\n    f.write(response.content)`}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* PDF Utilities Examples */}
          <Card>
            <CardHeader>
              <CardTitle>PDF Utilities</CardTitle>
              <CardDescription>
                Merge, split, compress, encrypt, watermark, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="merge">
                <TabsList className="mb-4">
                  <TabsTrigger value="merge">Merge</TabsTrigger>
                  <TabsTrigger value="split">Split</TabsTrigger>
                  <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
                  <TabsTrigger value="watermark">Watermark</TabsTrigger>
                </TabsList>

                <TabsContent value="merge" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`curl -X POST https://convertapipdf.onrender.com/api/pdf/merge \\
  -F "files=@document1.pdf" \\
  -F "files=@document2.pdf" \\
  -F "files=@document3.pdf" \\
  -o merged.pdf`}
                  </pre>
                  <CopyButton
                    id="merge-curl"
                    text={`curl -X POST https://convertapipdf.onrender.com/api/pdf/merge -F "files=@document1.pdf" -F "files=@document2.pdf" -o merged.pdf`}
                  />
                </TabsContent>

                <TabsContent value="split" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`curl -X POST https://convertapipdf.onrender.com/api/pdf/split \\
  -F "file=@document.pdf" \\
  -F 'ranges=["1-3", "4-6", "7-10"]' \\
  -o split-pdfs.zip`}
                  </pre>
                  <CopyButton
                    id="split-curl"
                    text={`curl -X POST https://convertapipdf.onrender.com/api/pdf/split -F "file=@document.pdf" -F 'ranges=["1-3", "4-6"]' -o split.zip`}
                  />
                </TabsContent>

                <TabsContent value="encrypt" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`curl -X POST https://convertapipdf.onrender.com/api/pdf/encrypt \\
  -F "file=@document.pdf" \\
  -F "password=mySecurePassword123" \\
  -o encrypted.pdf`}
                  </pre>
                  <CopyButton
                    id="encrypt-curl"
                    text={`curl -X POST https://convertapipdf.onrender.com/api/pdf/encrypt -F "file=@document.pdf" -F "password=myPassword" -o encrypted.pdf`}
                  />
                </TabsContent>

                <TabsContent value="watermark" className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm font-mono">
                    {`curl -X POST https://convertapipdf.onrender.com/api/pdf/watermark \\
  -F "file=@document.pdf" \\
  -F "text=CONFIDENTIAL" \\
  -F "opacity=0.3" \\
  -F "fontSize=48" \\
  -o watermarked.pdf`}
                  </pre>
                  <CopyButton
                    id="watermark-curl"
                    text={`curl -X POST https://convertapipdf.onrender.com/api/pdf/watermark -F "file=@document.pdf" -F "text=CONFIDENTIAL" -o watermarked.pdf`}
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
