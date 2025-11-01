# 📄 Professional PDF Conversion API

A comprehensive, production-ready REST API for document conversions powered by Gotenberg. Convert between PDF, Word, Excel, PowerPoint, images, and web formats with professional quality.

## 🌐 Live API

**Production URL**: `https://convertapipdf.onrender.com`  
**API Base**: `https://convertapipdf.onrender.com/api`  
**Documentation**: [View API Docs](https://convertapipdf.onrender.com/api-docs)

**Note**: The free tier deployment may take 30-60 seconds to wake up after inactivity. Consider using [UptimeRobot](https://uptimerobot.com) to keep it active 24/7 (see [DEPLOYMENT.md](DEPLOYMENT.md)).

## ✨ Features

### 📝 Office ↔ PDF Conversions
- **Word** (DOC, DOCX, ODT) ↔ PDF
- **Excel** (XLS, XLSX, ODS) ↔ PDF  
- **PowerPoint** (PPT, PPTX, ODP) ↔ PDF
- **OpenOffice** formats fully supported

### 🌐 Web to PDF
- **HTML** → PDF with CSS styling
- **URL** → PDF (screenshot any website)
- **Markdown** → PDF

### 🖼️ Image Conversions
- **Images** → PDF (JPG, PNG, WEBP, TIFF)
- **PDF** → Images (extract pages)
- Batch image to PDF conversion

### 🛠️ PDF Utilities
- **Merge** multiple PDFs
- **Split** PDF by page ranges
- **Compress** PDF files
- **Rotate** pages
- **Encrypt/Decrypt** with password protection
- **Watermark** PDFs with custom text
- **Extract** text and metadata
- **PDF/A** conversion (archival format)

### 🚀 Advanced Features
- Batch processing
- Custom page sizes and margins
- Quality settings (high/medium/low)
- Page range selection
- Orientation control
- Professional-grade output

## 🏗️ API Endpoints

### Office to PDF
```
POST /api/convert/docx-to-pdf      - Word to PDF
POST /api/convert/xlsx-to-pdf      - Excel to PDF
POST /api/convert/pptx-to-pdf      - PowerPoint to PDF
POST /api/convert/office-to-pdf    - Auto-detect Office format
```

### Web to PDF
```
POST /api/convert/html-to-pdf      - HTML to PDF
POST /api/convert/url-to-pdf       - URL to PDF
POST /api/convert/markdown-to-pdf  - Markdown to PDF
```

### Image Conversions
```
POST /api/convert/images-to-pdf    - Images to PDF
```

### PDF Utilities
```
POST /api/pdf/merge                - Merge PDFs
POST /api/pdf/split                - Split PDF
POST /api/pdf/rotate               - Rotate pages
POST /api/pdf/compress             - Compress PDF
POST /api/pdf/encrypt              - Encrypt PDF
POST /api/pdf/decrypt              - Decrypt PDF
POST /api/pdf/watermark            - Add watermark
POST /api/pdf/info                 - Get PDF metadata
POST /api/pdf/extract-text         - Extract text
POST /api/convert/pdf-to-pdfa      - Convert to PDF/A
```

### Information
```
GET /api/health                    - Health check
GET /api/formats                   - Supported formats
```

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

The easiest way to run locally with all dependencies:

```bash
# Clone the repository
git clone <your-repo-url>
cd pdf-conversion-api

# Start all services
docker-compose up

# API will be available at http://localhost:5000
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Start Gotenberg (in separate terminal)
docker run -p 3000:3000 gotenberg/gotenberg:8

# Set environment variable
export GOTENBERG_URL=http://localhost:3000

# Start the application
npm run dev

# API will be available at http://localhost:5000
```

### Option 3: Deploy to Render.com (Free Hosting)

1. **Fork this repository** to your GitHub account

2. **Go to [Render.com](https://render.com)** and sign up/login

3. **Click "New +" → "Blueprint"**

4. **Connect your GitHub repository**

5. **Render will automatically**:
   - Deploy Gotenberg service
   - Deploy the API
   - Configure environment variables
   - Set up health checks

6. **Your API will be live** at `https://your-app-name.onrender.com`

**📘 For detailed deployment guide including how to prevent sleep mode on free tier, see [DEPLOYMENT.md](DEPLOYMENT.md)**

No credit card required for free tier!

## 📖 Usage Examples

### JavaScript/Node.js

```javascript
// Convert Word to PDF
const formData = new FormData();
formData.append('file', wordFile);

const response = await fetch('https://convertapipdf.onrender.com/api/convert/docx-to-pdf', {
  method: 'POST',
  body: formData
});

const pdfBlob = await response.blob();
```

### Python

```python
import requests

# Convert Excel to PDF
files = {'file': open('spreadsheet.xlsx', 'rb')}
response = requests.post(
    'https://convertapipdf.onrender.com/api/convert/xlsx-to-pdf',
    files=files
)

with open('output.pdf', 'wb') as f:
    f.write(response.content)
```

### cURL

```bash
# Convert PowerPoint to PDF
curl -X POST https://convertapipdf.onrender.com/api/convert/pptx-to-pdf \
  -F "file=@presentation.pptx" \
  -o output.pdf

# Merge PDFs
curl -X POST https://convertapipdf.onrender.com/api/pdf/merge \
  -F "files=@file1.pdf" \
  -F "files=@file2.pdf" \
  -o merged.pdf

# HTML to PDF
curl -X POST https://convertapipdf.onrender.com/api/convert/html-to-pdf \
  -H "Content-Type: application/json" \
  -d '{"html": "<h1>Hello World</h1>"}' \
  -o output.pdf

# URL to PDF
curl -X POST https://convertapipdf.onrender.com/api/convert/url-to-pdf \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}' \
  -o webpage.pdf
```

### PHP

```php
<?php
// Convert Word to PDF
$ch = curl_init('https://convertapipdf.onrender.com/api/convert/docx-to-pdf');
$cfile = new CURLFile('document.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'document.docx');
$data = array('file' => $cfile);

curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
file_put_contents('output.pdf', $result);
curl_close($ch);
?>
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file (see `.env.example`):

```env
GOTENBERG_URL=http://gotenberg:3000
NODE_ENV=production
PORT=5000
MAX_FILE_SIZE=104857600
API_TIMEOUT=120000
```

### Advanced Office to PDF Options

All Office to PDF endpoints support comprehensive options for professional-quality output:

```javascript
// Example with all available options
const formData = new FormData();
formData.append('file', excelFile);

const options = {
  // Page Settings
  paperSize: 'A4',                    // 'A4', 'Letter', 'Legal', 'A3'
  orientation: 'landscape',           // 'portrait', 'landscape'
  nativePageRanges: '1-5',           // Specific pages (e.g., '1-5' or '1,3,5')
  
  // Image Quality (great for documents with images)
  losslessImageCompression: false,    // true = keep original quality, false = compress
  imageQuality: 85,                   // 1-100 (JPEG quality when lossless = false)
  reduceImageResolution: true,        // Reduce image DPI to decrease file size
  maxImageResolution: '300',          // '75', '150', '300', '600', '1200' DPI
  
  // Excel-Specific Options (fixes column cutoffs & empty pages!)
  singlePageSheets: true,             // Fit each Excel sheet on one PDF page
  
  // Other Options
  exportFormFields: true              // Include PDF form fields
};

formData.append('options', JSON.stringify(options));

const response = await fetch('https://convertapipdf.onrender.com/api/convert/xlsx-to-pdf', {
  method: 'POST',
  body: formData
});
```

#### Image Quality Presets

**Smallest file size (low quality):**
```javascript
{
  losslessImageCompression: false,
  imageQuality: 30,
  reduceImageResolution: true,
  maxImageResolution: '75'
}
```

**Balanced (recommended):**
```javascript
{
  losslessImageCompression: false,
  imageQuality: 70,
  reduceImageResolution: true,
  maxImageResolution: '150'
}
```

**Highest quality (large file):**
```javascript
{
  losslessImageCompression: true,
  reduceImageResolution: false
}
```

#### Excel Conversion Tips

If you're experiencing issues with Excel files (empty pages, cut-off columns), use:
```javascript
{
  singlePageSheets: true,       // Fits each sheet on one page
  orientation: 'landscape',      // Better for wide spreadsheets
  paperSize: 'A3'               // Larger paper size
}
```

## 🏢 Production Deployment

### Render.com (Free Tier)

**Pros:**
- ✅ Completely free (no credit card)
- ✅ Auto-deploys from GitHub
- ✅ SSL included
- ❌ Apps sleep after inactivity

**Steps:**
1. Push code to GitHub
2. Connect to Render.com
3. Deploy via `render.yaml`

### Fly.io (Free Tier)

**Pros:**
- ✅ Always-on (no sleep)
- ✅ Great Docker support
- ❌ Requires credit card

**Steps:**
```bash
flyctl launch
flyctl deploy
```

### Railway (Free Trial)

**Pros:**
- ✅ Easy setup
- ✅ Good performance
- ❌ $5/month after trial

## 📊 Technical Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Conversion Engine**: [Gotenberg](https://gotenberg.dev/) (open-source)
- **PDF Library**: pdf-lib
- **Image Processing**: Sharp
- **File Upload**: Multer
- **TypeScript**: Full type safety

## 🔒 Security

- File size limits (default 100MB)
- Timeout protection
- Input validation
- Secure file handling
- No permanent file storage (stateless)

## 📈 Limits

### Free Tier (Render.com)
- 512MB RAM
- 30-second cold start after inactivity
- Good for testing and small projects

### Recommended for Production
- Render.com Starter: $7/month
- Fly.io Paid: ~$5-10/month
- Self-hosted with Docker

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📄 License

MIT License - Free for commercial and personal use

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: This README
- **Gotenberg Docs**: https://gotenberg.dev/docs

## 🎯 Use Cases

Perfect for:
- 📄 Document management systems
- 🌐 Web applications needing PDF generation
- 📱 Mobile app backends
- 🤖 Automation workflows
- 📊 Report generation
- 🎓 Educational platforms
- 💼 Business applications

## 🔄 Version History

- **v1.0.0** - Initial release with 30+ endpoints
  - Office to PDF conversions
  - Web to PDF
  - PDF utilities (merge, split, compress, etc.)
  - Image conversions
  - Production-ready deployment configs

---

**Built with ❤️ using Gotenberg and Node.js**

For questions or commercial support, open an issue on GitHub.
