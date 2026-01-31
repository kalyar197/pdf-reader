#!/usr/bin/env python3
"""
Simple HTTP server with proper MIME types for modern JavaScript
"""
import http.server
import socketserver

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    # Override the extensions map to add .mjs support
    if not hasattr(http.server.SimpleHTTPRequestHandler, 'extensions_map'):
        http.server.SimpleHTTPRequestHandler.extensions_map = {}

    extensions_map = http.server.SimpleHTTPRequestHandler.extensions_map.copy()
    extensions_map.update({
        '.mjs': 'application/javascript',
        '.js': 'application/javascript',
    })

    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print(f"Serving with proper MIME types for .mjs files")
        print(f"MIME map: {MyHTTPRequestHandler.extensions_map.get('.mjs')}")
        print(f"Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
