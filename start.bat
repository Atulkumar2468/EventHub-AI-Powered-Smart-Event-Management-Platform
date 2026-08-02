@echo off
echo ╔══════════════════════════════════════════╗
echo ║   MIT-WPU EventHub — MERN Stack Boot     ║
echo ║   Midnight Neon // Campus Command        ║
echo ╚══════════════════════════════════════════╝
echo.
echo [1/2] Starting Backend Server (Port 5000)...
start cmd /k "cd /d "%~dp0server" && node index.js"
echo.
echo [2/2] Starting Frontend Client (Port 5173)...
timeout /t 2 /nobreak >nul
start cmd /k "cd /d "%~dp0client" && npm run dev"
echo.
echo ✓ Both servers starting...
echo   Backend:  http://localhost:5000/api/health
echo   Frontend: http://localhost:5173
echo.
pause
