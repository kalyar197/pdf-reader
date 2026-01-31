// ========================================
// PDF Reader with Translation - Main App
// ========================================

// DOM Elements
const brightnessOverlay = document.getElementById('brightness-overlay');
const translationPopup = document.getElementById('translation-popup');
const pdfViewer = document.getElementById('pdf-viewer');
const dropZone = document.getElementById('drop-zone');

// State
let hideTimeout;
let isIframeReady = false;

// ========================================
// PDF Viewer Setup
// ========================================

pdfViewer.addEventListener('load', () => {
    console.log('PDF viewer iframe loaded');
    isIframeReady = true;
    setupTextSelection();
    injectBrightnessControl();
});

function setupTextSelection() {
    try {
        // Access the iframe's document
        const iframeDoc = pdfViewer.contentDocument || pdfViewer.contentWindow.document;

        if (!iframeDoc) {
            console.error('Cannot access iframe document - possible CORS issue');
            return;
        }

        // Listen for text selection inside iframe
        iframeDoc.addEventListener('mouseup', handleTextSelection);
        iframeDoc.addEventListener('touchend', handleTextSelection);

        console.log('Text selection listeners attached');
    } catch (error) {
        console.error('Error setting up text selection:', error);
        // If CORS blocks iframe access, show warning
        if (error.name === 'SecurityError') {
            console.warn('CORS blocked - need to run from local server');
            console.warn('Run: python -m http.server 8000');
        }
    }
}

// ========================================
// Text Selection & Translation
// ========================================

function handleTextSelection(event) {
    try {
        // Get selected text from iframe
        const selection = pdfViewer.contentWindow.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length === 0) {
            hideTranslation();
            return;
        }

        // Don't translate very long selections (likely accidental)
        if (selectedText.length > 500) {
            console.log('Selection too long, skipping translation');
            return;
        }

        // Get position of selected text
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Position popup (account for iframe offset)
        const viewerRect = pdfViewer.getBoundingClientRect();
        showTranslation(
            selectedText,
            viewerRect.left + rect.left + window.scrollX,
            viewerRect.top + rect.bottom + window.scrollY + 5
        );
    } catch (error) {
        console.error('Error handling text selection:', error);
    }
}

async function showTranslation(text, x, y) {
    // Show popup immediately with loading state
    translationPopup.style.display = 'block';
    translationPopup.querySelector('.original').textContent = text;
    translationPopup.querySelector('.translated').textContent = 'Translating...';
    translationPopup.querySelector('.translated').className = 'translated loading';

    // Position popup
    positionPopup(x, y);

    // Translate the text
    try {
        console.log('Translating:', text.substring(0, 50) + '...');
        const translation = await translateText(text, 'fr', 'en');

        translationPopup.querySelector('.translated').textContent = translation;
        translationPopup.querySelector('.translated').className = 'translated';

        // Re-position in case size changed
        positionPopup(x, y);
    } catch (error) {
        translationPopup.querySelector('.translated').textContent = '❌ Translation failed. Check network connection.';
        translationPopup.querySelector('.translated').className = 'translated';
        console.error('Translation error:', error);
    }

    // Auto-hide after 15 seconds
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hideTranslation, 15000);
}

function positionPopup(x, y) {
    // Initial position
    let popupX = x;
    let popupY = y;

    // Get popup dimensions (after content is set)
    const popupRect = translationPopup.getBoundingClientRect();
    const popupWidth = popupRect.width;
    const popupHeight = popupRect.height;

    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Adjust if popup goes off right edge
    if (popupX + popupWidth > windowWidth - 10) {
        popupX = windowWidth - popupWidth - 10;
    }

    // Adjust if popup goes off left edge
    if (popupX < 10) {
        popupX = 10;
    }

    // Adjust if popup goes off bottom edge
    if (popupY + popupHeight > windowHeight - 10) {
        popupY = y - popupHeight - 10; // Position above selection
    }

    // Adjust if popup goes off top edge
    if (popupY < 10) {
        popupY = 10;
    }

    translationPopup.style.left = `${popupX}px`;
    translationPopup.style.top = `${popupY}px`;
}

function hideTranslation() {
    translationPopup.style.display = 'none';
}

// Click anywhere to hide popup
document.addEventListener('click', (e) => {
    if (!translationPopup.contains(e.target)) {
        hideTranslation();
    }
});

// ========================================
// Brightness Control Injection
// ========================================

function injectBrightnessControl() {
    try {
        const iframeDoc = pdfViewer.contentDocument || pdfViewer.contentWindow.document;

        if (!iframeDoc) {
            console.error('Cannot access iframe document');
            return;
        }

        // Find the toolbar right section (after Tools button)
        const toolbarRight = iframeDoc.getElementById('toolbarViewerRight');
        if (!toolbarRight) {
            console.error('Toolbar not found');
            return;
        }

        // Create separator
        const separator = iframeDoc.createElement('div');
        separator.className = 'verticalToolbarSeparator';

        // Create brightness control container
        const brightnessContainer = iframeDoc.createElement('div');
        brightnessContainer.id = 'brightnessControl';
        brightnessContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 8px;
            height: 32px;
        `;

        // Create slider
        const slider = iframeDoc.createElement('input');
        slider.type = 'range';
        slider.id = 'brightness-slider';
        slider.min = '0';
        slider.max = '80';
        slider.value = '0';
        slider.step = '5';
        slider.title = 'Brightness';
        slider.style.cssText = `
            width: 80px;
            height: 4px;
            cursor: pointer;
            -webkit-appearance: none;
            appearance: none;
            background: #d3d3d3;
            border-radius: 2px;
            outline: none;
        `;

        // Style slider thumb
        const style = iframeDoc.createElement('style');
        style.textContent = `
            #brightness-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #4d4d4d;
                cursor: pointer;
            }
            #brightness-slider::-moz-range-thumb {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #4d4d4d;
                cursor: pointer;
                border: none;
            }
            #brightness-slider:hover::-webkit-slider-thumb {
                background: #000;
            }
            #brightness-slider:hover::-moz-range-thumb {
                background: #000;
            }
        `;
        iframeDoc.head.appendChild(style);

        // Create value display
        const valueSpan = iframeDoc.createElement('span');
        valueSpan.id = 'brightness-value';
        valueSpan.textContent = '0%';
        valueSpan.style.cssText = `
            font-size: 12px;
            color: var(--toolbar-fg-color);
            min-width: 30px;
            text-align: right;
        `;

        // Create icon
        const icon = iframeDoc.createElement('span');
        icon.textContent = '☀';
        icon.style.cssText = `
            font-size: 16px;
            color: var(--toolbar-fg-color);
        `;

        // Assemble
        brightnessContainer.appendChild(icon);
        brightnessContainer.appendChild(slider);
        brightnessContainer.appendChild(valueSpan);

        // Insert into toolbar (after Tools button)
        toolbarRight.appendChild(separator);
        toolbarRight.appendChild(brightnessContainer);

        // Add event listener for brightness changes
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            const opacity = value / 100;
            brightnessOverlay.style.background = `rgba(0, 0, 0, ${opacity})`;
            valueSpan.textContent = `${value}%`;
        });

        console.log('Brightness control injected into PDF.js toolbar');
    } catch (error) {
        console.error('Error injecting brightness control:', error);
    }
}

// ========================================
// Translation Service
// ========================================

async function translateText(text, sourceLang, targetLang) {
    // Try multiple translation services with fallback

    // Option 1: Try unofficial Google Translate API
    try {
        return await translateWithGoogle(text, sourceLang, targetLang);
    } catch (error) {
        console.warn('Google Translate failed, trying fallback:', error);
    }

    // Option 2: Try LibreTranslate as fallback
    try {
        return await translateWithLibreTranslate(text, sourceLang, targetLang);
    } catch (error) {
        console.warn('LibreTranslate failed:', error);
    }

    // If all fail, throw error
    throw new Error('All translation services failed');
}

async function translateWithGoogle(text, sourceLang, targetLang) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Parse response (format: [[[translated, original, ...]]])
    if (data && data[0] && data[0][0] && data[0][0][0]) {
        // If multiple segments, concatenate them
        let translation = '';
        for (let i = 0; i < data[0].length; i++) {
            if (data[0][i][0]) {
                translation += data[0][i][0];
            }
        }
        return translation || text;
    }

    throw new Error('Invalid response format from Google Translate');
}

async function translateWithLibreTranslate(text, sourceLang, targetLang) {
    const url = 'https://libretranslate.de/translate';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: 'text'
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.translatedText) {
        return data.translatedText;
    }

    throw new Error('Invalid response format from LibreTranslate');
}

// ========================================
// Initialization
// ========================================

console.log('PDF Reader with Translation initialized');
console.log('- Use the "Open" button in the PDF.js toolbar to load a PDF');
console.log('- Select text to translate from French to English');
console.log('- Use the brightness slider in the toolbar to adjust darkness');
