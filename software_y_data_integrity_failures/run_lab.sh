#!/bin/bash
PORT=8000
echo ""
echo "🚀 Laboratorio Software & Data Integrity Failures"
echo "=============================================="
echo "🌐 Abre tu navegador en: http://localhost:$PORT"
echo "📂 Carpeta actual: $(pwd)"
echo ""
python3 -m http.server $PORT

