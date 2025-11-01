# PDF Conversion API - Design Guidelines

## Design Approach

**Selected Approach:** Hybrid Reference + System
- **Primary References:** Smallpdf, CloudConvert, WeTransfer
- **Design Principles:** 
  - Clarity over cleverness - every element serves the conversion workflow
  - Progressive disclosure - show complexity only when needed
  - Instant feedback - users always know what's happening
  - Trust through polish - professional aesthetic builds confidence in file handling

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts) - UI elements, body text, labels
- Monospace: JetBrains Mono - API endpoints, code snippets, technical details

**Type Scale:**
- Hero Headline: text-5xl md:text-6xl font-bold
- Section Headers: text-3xl md:text-4xl font-bold
- Card Titles: text-xl font-semibold
- Body Text: text-base font-normal
- Labels/Metadata: text-sm font-medium
- Technical/Code: text-sm font-mono
- Fine Print: text-xs

## Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, and 16 consistently
- Component padding: p-6, p-8
- Section spacing: py-12, py-16, py-24
- Card gaps: gap-4, gap-6, gap-8
- Element margins: mb-4, mb-6, mb-8

**Grid System:**
- Main container: max-w-7xl mx-auto px-4 md:px-6
- Two-column layouts: grid grid-cols-1 md:grid-cols-2 gap-8
- Three-column features: grid grid-cols-1 md:grid-cols-3 gap-6
- Content max-width: max-w-4xl for readability

## Core Component Library

### Navigation
**Header:**
- Full-width with max-w-7xl container
- Logo (left), navigation links (center), CTA button (right)
- Height: h-16 md:h-20
- Sticky positioning on scroll

### Hero Section
**Layout:**
- Two-column grid on desktop (60/40 split)
- Left: Headline, description, primary CTA, trust indicators
- Right: Animated conversion preview or illustration (not a real image - use geometric shapes/icons to represent file conversion)
- Padding: py-16 md:py-24

**Elements:**
- Headline with gradient text treatment (via CSS, not specified colors)
- Subheadline: max-w-2xl, text-lg
- Primary CTA: Large button with arrow icon
- Trust badges: "Secure • Private • Fast" with icons
- No background image needed - use subtle geometric patterns via SVG

### File Upload Zone
**Primary Conversion Interface:**
- Large dropzone: min-h-64 md:min-h-80
- Dashed border with rounded corners (rounded-2xl)
- Icon-driven states: Upload, Processing, Complete
- File type badges showing supported formats
- Drag-and-drop with hover state indicators

**Layout Structure:**
```
Dropzone Container
├── Icon (large file icon, changes based on state)
├── Primary text: "Drop your file here"
├── Secondary text: "or click to browse"
├── Supported formats: Pills/badges for PDF, DOCX, XLSX
└── Max file size indicator
```

### Conversion Options Panel
**Expandable Settings:**
- Accordion-style sections
- Quality settings (High/Medium/Low) as radio buttons
- Page range selector for PDFs
- Table detection toggle for Excel conversions
- Output format selector with format icons
- Spacing between options: space-y-4

### Progress Indicator
**Multi-State Component:**
- Upload progress bar
- Processing spinner with percentage
- Success state with checkmark animation
- Error state with retry button
- Each state: p-6, rounded-xl borders

### Download Section
**Result Display:**
- File preview card with metadata
- Filename, size, format, timestamp
- Large download button (primary CTA)
- Secondary actions: View details, Convert another
- Share/copy link option

### Features Grid
**Three-Column Layout:**
- Icon (top), title, description per card
- Cards with subtle borders, rounded-lg, p-6
- Icons: Use Heroicons via CDN
- Spacing: gap-6 md:gap-8

**Feature Cards Include:**
1. Multiple Format Support (icon: document-text)
2. Batch Conversion (icon: document-duplicate)
3. Secure Processing (icon: shield-check)
4. API Access (icon: code-bracket)
5. Fast Processing (icon: bolt)
6. No Registration (icon: user-minus)

### API Documentation Preview
**Two-Column Split:**
- Left: Endpoint descriptions, parameters, use cases
- Right: Code examples in dark code blocks
- Tabs for different languages (cURL, JavaScript, Python)
- Copy button on all code snippets
- Spacing: p-8, gap-8

### Footer
**Comprehensive Multi-Section:**
- Four-column grid on desktop, stacked on mobile
- Column 1: Logo, tagline, social links
- Column 2: Product links (Features, Pricing, API Docs)
- Column 3: Resources (Blog, Support, Status)
- Column 4: Legal (Privacy, Terms, Security)
- Bottom bar: Copyright, language selector
- Padding: py-12, gap-8

## Page Structure

**Landing Page Sections (in order):**
1. Hero with conversion preview
2. Quick conversion demo (embedded functional tool)
3. Key features grid (6 features, 3-column)
4. How it works (3-step process)
5. API overview with code example
6. Supported formats showcase
7. Trust/security section
8. FAQ accordion
9. Final CTA banner
10. Comprehensive footer

**Conversion Tool Interface:**
- Sticky header with progress breadcrumb
- Main conversion area (centered, max-w-4xl)
- Sidebar with recent conversions (desktop only)
- Settings panel (collapsible on mobile)

## Interaction Patterns

### File Upload Flow
1. Empty dropzone state
2. Drag-over highlight state
3. File selected state (shows filename, size)
4. Processing state (progress bar, spinner)
5. Complete state (preview, download)

### Status Feedback
- Toast notifications for actions (top-right positioning)
- Inline validation messages
- Loading skeletons during API calls
- Success/error badges with icons

### Mobile Adaptations
- Single column layouts on mobile
- Bottom sheet for conversion options
- Simplified header with hamburger menu
- Floating action button for quick conversion
- Full-screen modals for settings

## Images

**Hero Section:**
- No photographic image needed
- Use SVG illustration showing document transformation
- Geometric shapes representing files (document icons) with connecting arrows
- Animated elements showing conversion flow
- Abstract, modern style focusing on the conversion concept

**Feature Icons:**
- Use Heroicons throughout (outline style)
- Consistent sizing: w-8 h-8 for feature cards, w-6 h-6 for inline icons

**Format Badges:**
- Small icons representing file types (PDF, Word, Excel icons)
- Display in pills/badges with format abbreviations
- Use in: upload zone, feature grid, supported formats section

This design prioritizes clarity and workflow efficiency while maintaining visual polish through consistent spacing, clear typography hierarchy, and purposeful component design. Every element serves the core conversion functionality while building user trust through professional presentation.