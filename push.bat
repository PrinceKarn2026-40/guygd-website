@echo off
cd /d "%~dp0"
git add .
set /p msg="Commit message: "
git commit -m "%msg%"
git push origin main
echo.
echo Done! Railway is now deploying...
pause
