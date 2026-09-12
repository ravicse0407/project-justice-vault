@echo off
title Justice Vault - Lenovo LEAP Hackathon 2026
echo ======================================================================
echo           JUSTICE VAULT - Evidence-Grounded AI Action Engine
echo           Lenovo LEAP AI Hackathon 2026 - Theme 2: Public Access
echo ======================================================================
echo.
echo Starting FastAPI Backend and Vite Frontend...
echo.

set PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%

start "Justice Vault Backend (Port 8000)" cmd /k "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

start "Justice Vault Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening browser at http://127.0.0.1:5173 ...
start http://127.0.0.1:5173

echo.
echo ======================================================================
echo Application is live:
echo - Frontend:  http://127.0.0.1:5173
echo - Backend:   http://127.0.0.1:8000
echo - API Docs:  http://127.0.0.1:8000/docs
echo ======================================================================
pause
