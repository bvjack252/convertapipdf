import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileSpreadsheet, FileImage, Globe, Settings, ArrowRight } from "lucide-react";
import { OfficeConverter } from "@/components/OfficeConverter";
import { ImageConverter } from "@/components/ImageConverter";
import { WebConverter } from "@/components/WebConverter";
import { PdfUtilities } from "@/components/PdfUtilities";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" data-testid="icon-logo" />
            <h1 className="text-xl font-bold" data-testid="text-app-title">PDF Converter</h1>
          </div>
          <Link href="/api-docs">
            <Button variant="outline" size="sm" data-testid="button-api-docs">
              API Docs <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-hero-title">
              Professional Document Conversion
            </h2>
            <p className="text-lg text-muted-foreground mb-6" data-testid="text-hero-description">
              Convert between PDF, Office documents, images, and web formats. 
              30+ formats supported with professional quality results.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2" data-testid="feature-secure">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Secure
              </div>
              <div className="flex items-center gap-2" data-testid="feature-private">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Private
              </div>
              <div className="flex items-center gap-2" data-testid="feature-fast">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Fast
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Converter */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Tabs defaultValue="office" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8" data-testid="tabs-converter">
              <TabsTrigger value="office" className="gap-2" data-testid="tab-office">
                <FileText className="w-4 h-4" />
                Office
              </TabsTrigger>
              <TabsTrigger value="images" className="gap-2" data-testid="tab-images">
                <FileImage className="w-4 h-4" />
                Images
              </TabsTrigger>
              <TabsTrigger value="web" className="gap-2" data-testid="tab-web">
                <Globe className="w-4 h-4" />
                Web
              </TabsTrigger>
              <TabsTrigger value="utilities" className="gap-2" data-testid="tab-utilities">
                <Settings className="w-4 h-4" />
                PDF Tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value="office" data-testid="content-office">
              <OfficeConverter />
            </TabsContent>

            <TabsContent value="images" data-testid="content-images">
              <ImageConverter />
            </TabsContent>

            <TabsContent value="web" data-testid="content-web">
              <WebConverter />
            </TabsContent>

            <TabsContent value="utilities" data-testid="content-utilities">
              <PdfUtilities />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h3 className="text-2xl font-bold text-center mb-12" data-testid="text-features-title">
            Powerful Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">30+ Formats</CardTitle>
                <CardDescription>
                  Support for Word, Excel, PowerPoint, images, and more
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">PDF Utilities</CardTitle>
                <CardDescription>
                  Merge, split, compress, rotate, encrypt, and watermark
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">REST API</CardTitle>
                <CardDescription>
                  Easy-to-use API for developers. Use from any language
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">High Quality</CardTitle>
                <CardDescription>
                  Professional-grade conversions powered by Gotenberg
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Batch Processing</CardTitle>
                <CardDescription>
                  Convert multiple files at once for efficiency
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Free & Open Source</CardTitle>
                <CardDescription>
                  No hidden fees. Deploy anywhere with Docker
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center text-sm text-muted-foreground">
            <p data-testid="text-footer">
              Powered by Gotenberg • Open Source • MIT License
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
