#!/usr/bin/env python3
"""
Simple HTTP server for Block Blast Game
Serves the game files with proper CORS headers for Appodeal integration
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for Appodeal integration
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        # Custom log format
        sys.stdout.write(f"[{self.log_date_time_string()}] {format % args}\n")

def main():
    PORT = 8000
    
    # Check if port is available
    try:
        with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
            print(f"🚀 Block Blast Game Server запущен!")
            print(f"📱 Откройте в браузере: http://localhost:{PORT}/block-blast-game.html")
            print(f"📱 Мобильная версия: http://{get_local_ip()}:{PORT}/block-blast-game.html")
            print(f"📊 Статус сервера: http://localhost:{PORT}/")
            print(f"🛑 Для остановки нажмите Ctrl+C")
            print("-" * 50)
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n🛑 Сервер остановлен")
                httpd.shutdown()
                
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Порт {PORT} уже используется. Попробуйте другой порт:")
            print(f"   python3 server.py --port 8001")
        else:
            print(f"❌ Ошибка запуска сервера: {e}")
        sys.exit(1)

def get_local_ip():
    """Get local IP address for mobile testing"""
    import socket
    try:
        # Connect to a remote server to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "localhost"

if __name__ == "__main__":
    # Parse command line arguments
    if len(sys.argv) > 1 and sys.argv[1] == "--port":
        try:
            PORT = int(sys.argv[2])
        except (IndexError, ValueError):
            print("❌ Неверный формат порта. Используйте: --port 8000")
            sys.exit(1)
    else:
        PORT = 8000
    
    main()