# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a custom PDF reader application designed with two primary features:
1. **Brightness Control**: Independent brightness adjustment via overlay/slider (not system-level)
2. **French Dictionary Integration**: Click/highlight words to get instant translations without copy-pasting

## Core Requirements

### Essential Features
- PDF rendering and navigation
- Brightness control via transparent overlay (not pixel manipulation)
- Text selection detection with coordinate tracking
- Dictionary lookup triggered by word selection
- Pop-up or side panel for displaying translations

### Technical Constraints
- Use existing PDF rendering libraries (MuPDF/PyMuPDF, PDF.js, or Poppler) rather than building from scratch
- Brightness should be implemented as a semi-transparent overlay with adjustable opacity
- Dictionary should work with either a free API (e.g., Free Dictionary API) or local JSON files
- Text selection should use the library's built-in `getText()` or `onSelection` events

## Technology Stack Options

The project direction depends on the chosen technology:

### Option 1: Python (Recommended for Desktop)
- **PDF Engine**: PyMuPDF (provides `page.get_text("words")` for word coordinates)
- **UI Framework**: Tkinter or PyQt
- **Dictionary**: Local JSON or REST API calls

### Option 2: JavaScript/Electron (Recommended for Cross-Platform)
- **PDF Engine**: PDF.js (Mozilla's library)
- **UI Framework**: React or vanilla JS with Electron
- **Dictionary**: REST API with fetch/axios

### Option 3: C#/.NET (Windows-focused)
- **PDF Engine**: PDFium or custom wrapper
- **UI Framework**: WPF or WinForms
- **Dictionary**: HttpClient with dictionary API

## Architecture Pattern

```
┌─────────────────────────────────────┐
│     User Interface Layer            │
│  (Brightness Slider, Page Controls) │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   PDF Rendering + Text Extraction   │
│    (Library: PyMuPDF/PDF.js/etc)    │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌─────▼──────────┐
│  Brightness │  │   Dictionary   │
│   Overlay   │  │   Service      │
└─────────────┘  └────────────────┘
```

## Implementation Notes

### Brightness Control
- Create full-screen overlay element with black background
- Use opacity/alpha channel: `rgba(0, 0, 0, brightness_level)` where 0.0 = bright, 0.8 = very dark
- Bind slider to opacity property in real-time

### Dictionary Lookup
- Intercept text selection events from PDF library
- Extract selected text string
- Query dictionary API or local database
- Display in non-intrusive pop-over positioned near selection
- Cache frequently looked-up words to reduce API calls

### Text Selection Detection
- Use library-specific methods (e.g., PyMuPDF's `page.get_text("words")` returns coordinates)
- Alternatively, use browser selection API if using web technologies
- Consider click vs. highlight behavior for user experience

## Reference Projects

These GitHub repositories provide structural examples (see "My chat.txt" for full list):
- **PdfViewer (omeryanar)**: C#/.NET with annotation support
- **SumatraPDF**: C++ reference for performance optimization
- **PDF-Reader (ashraful-talukder)**: Simple Python/Tkinter starter
- **React-PDF-Viewer**: Modern web-based approach with Electron

## Development Workflow

When starting development:
1. Choose technology stack based on developer's language preference
2. Set up basic PDF rendering with minimal UI
3. Implement page navigation (next/previous, zoom)
4. Add brightness overlay with slider control
5. Implement text selection detection
6. Integrate dictionary API or local lookup
7. Polish UI/UX for pop-up positioning and responsiveness

## API Considerations

### Dictionary API Options
- Free Dictionary API (no auth required)
- Google Translate API (requires key)
- Local JSON dictionary files (offline-first approach)
- Consider rate limiting and caching strategies

### Error Handling
- Handle missing PDF pages gracefully
- Manage API failures with fallback behavior
- Validate text selection before dictionary lookup (avoid punctuation-only selections)
