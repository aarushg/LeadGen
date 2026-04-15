@echo off
setlocal

cd /d "%~dp0"

where docker >nul 2>&1
if errorlevel 1 (
  echo Docker CLI is not installed or not in PATH.
  echo Install Docker Desktop, then try again.
  exit /b 1
)

echo [1/2] Building and starting LeadGen container...
docker compose up --build -d
if errorlevel 1 (
  echo Docker Compose failed to start the app.
  exit /b 1
)

echo [2/2] LeadGen is launching at http://localhost:3001
echo.
echo Useful commands:
echo   docker compose logs -f
echo   docker compose down

start "" "http://localhost:3001"
pause
exit /b 0
