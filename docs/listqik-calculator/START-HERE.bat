@echo off
title ListQik Investment Calculators
cd /d "%~dp0"

echo.
echo  ListQik Investment Calculators
echo  ==============================
echo.

where python >nul 2>nul
if %errorlevel%==0 (
    echo  Starting local website at http://localhost:8080
    echo  Keep this window open while using the calculators.
    echo  Press Ctrl+C to stop the server.
    echo.
    start "" "http://localhost:8080/"
    python -m http.server 8080
    goto :end
)

where py >nul 2>nul
if %errorlevel%==0 (
    echo  Starting local website at http://localhost:8080
    echo  Keep this window open while using the calculators.
    echo  Press Ctrl+C to stop the server.
    echo.
    start "" "http://localhost:8080/"
    py -m http.server 8080
    goto :end
)

echo  Python was not found. Opening the calculator file directly...
echo  If the page looks wrong, install Python from https://python.org
echo  then run this file again.
echo.
start "" "%~dp0investment-calculators.html"
pause

:end
