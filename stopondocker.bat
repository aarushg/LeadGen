@echo off
setlocal

cd /d "%~dp0"

where docker >nul 2>&1
if errorlevel 1 (
  echo Docker CLI is not installed or not in PATH.
  echo Install Docker Desktop, then try again.
  exit /b 1
)

echo Shutting down LeadGen Docker stack...
docker compose down
if errorlevel 1 (
  echo Failed to stop Docker Compose stack cleanly.
  exit /b 1
)

echo LeadGen Docker stack stopped and cleaned up.
pause
exit /b 0
