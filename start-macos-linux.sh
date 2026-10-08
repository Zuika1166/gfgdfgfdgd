#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
PORT=8765
if command -v python3 >/dev/null 2>&1; then
    echo "Open http://localhost:$PORT in your browser"
    exec python3 -m http.server "$PORT" --bind 127.0.0.1
elif command -v python >/dev/null 2>&1; then
    echo "Open http://localhost:$PORT in your browser"
    exec python -m http.server "$PORT" --bind 127.0.0.1
else
    echo "Python 3 required: https://www.python.org/downloads/" >&2
    exit 1
fi
