@echo off
cd /d "%~dp0"
set PORT=8765
where py >nul 2>&1
if %ERRORLEVEL%==0 (
    start "" "http://localhost:%PORT%"
    py -3 -m http.server %PORT% --bind 127.0.0.1
    goto :end
)
where python >nul 2>&1
if %ERRORLEVEL%==0 (
    start "" "http://localhost:%PORT%"
    python -m http.server %PORT% --bind 127.0.0.1
    goto :end
)
echo Python is not installed. Install Python 3 from https://www.python.org/downloads/
pause
:end
