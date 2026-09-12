# Justice Vault One-Click PowerShell Launcher
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "          JUSTICE VAULT - Evidence-Grounded AI Action Engine" -ForegroundColor White
Write-Host "          Lenovo LEAP AI Hackathon 2026 - Theme 2: Public Access" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan

$env:Path = "$env:LOCALAPPDATA\Programs\nodejs;$env:Path"

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 2

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Start-Sleep -Seconds 3

# Launch Browser
Start-Process "http://127.0.0.1:5173"

Write-Host "Application is live:" -ForegroundColor Green
Write-Host "  Frontend:  http://127.0.0.1:5173" -ForegroundColor White
Write-Host "  Backend:   http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  API Docs:  http://127.0.0.1:8000/docs" -ForegroundColor White
