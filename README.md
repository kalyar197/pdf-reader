# PDF Reader with Translation

A simple, modern PDF reader with French-to-English translation and brightness control.

## Features

- 📄 **PDF Viewing**: Uses Mozilla's PDF.js (same engine as Chrome's PDF viewer)
- 🌐 **Translation**: Select any text to translate from French to English
- 🔆 **Brightness Control**: Adjustable overlay to reduce eye strain
- 🎯 **Simple & Fast**: Just HTML/CSS/JavaScript - no complex setup

## How to Use

### Method 1: Local Web Server (Recommended)

Due to browser security (CORS), you need to run a local web server:

**Option A: Node.js http-server (Recommended - Proper MIME types)**
```bash
cd "C:\Users\majee\Desktop\pdf reader"
npx http-server -p 8000 --cors
```

Then open: http://localhost:8000

**Option B: Custom Python server (Proper MIME types)**
```bash
cd "C:\Users\majee\Desktop\pdf reader"
python server.py
```

Then open: http://localhost:8000

**Option C: Standard Python 3 (May have MIME type issues)**
```bash
cd "C:\Users\majee\Desktop\pdf reader"
python -m http.server 8000
```

Then open: http://localhost:8000

**⚠️ IMPORTANT:** After opening the page for the first time, do a **hard refresh** to clear browser cache:
- Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

This is necessary because browsers may cache incorrect MIME types from previous server sessions.

### Method 2: Browser Extensions (Alternative)

Install a local web server extension:
- Chrome: "Web Server for Chrome"
- Firefox: "Live Server"

### Opening PDFs

Once the server is running:
1. **Drag and drop** a PDF file onto the window
2. **Double-click** anywhere to browse for a PDF file

### Using Features

**Translation:**
- Highlight any text in the PDF
- A translation popup will appear automatically
- Works with French, but also tries to translate other languages
- Click outside the popup or wait 15 seconds to dismiss

**Brightness:**
- Use the slider in the top-right corner
- Range: 0% (no darkening) to 80% (very dark)
- Perfect for reading at night

## Project Structure

```
pdf reader/
├── index.html              # Main HTML page
├── app.js                  # Application logic
├── CLAUDE.md               # Development guide
├── README.md               # This file
└── lib/
    ├── pdfjs-build/        # PDF.js core library
    └── pdfjs-web/          # PDF.js viewer UI
        └── viewer.html     # Pre-built PDF viewer
```

## Translation Services

The app uses multiple translation services with automatic fallback:

1. **Google Translate** (unofficial API) - Primary
2. **LibreTranslate** (open source) - Fallback

Both are free and require no API keys!

## Troubleshooting

### Translation not working?
- Check your internet connection
- Open browser DevTools (F12) and check Console for errors
- The first translation may take a moment

### Can't select text?
- Make sure the PDF has a text layer (not a scanned image without OCR)
- Most modern PDFs support text selection

### Blank screen?
- Make sure you're running from a local web server (see Method 1 above)
- Check browser console for CORS errors

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Any modern browser

## Tips

- **Short phrases translate better** than entire paragraphs
- You can translate **any language** to English (not just French)
- The **brightness slider** doesn't affect the PDF file itself, only the display
- **Translations are not saved** - they're fetched on-demand

## Advanced: Desktop App

Want a standalone desktop app? See CLAUDE.md for Electron wrapper instructions.

## Credits

- PDF rendering: [PDF.js](https://mozilla.github.io/pdf.js/) by Mozilla
- Translation: Google Translate & LibreTranslate
- Built with: Pure HTML/CSS/JavaScript

---

**Enjoy reading and learning! 📚🌍**
