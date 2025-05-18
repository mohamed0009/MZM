@echo off
echo =============================
echo PharmaFlow Application Runner
echo =============================

echo Starting Spring Boot Backend Server...
start cmd /k "cd server && run-server.bat"

echo Waiting for the backend to start...
timeout /t 10

echo Starting Frontend Application...
start cmd /k "cd frontend && .\\connect-to-backend.bat"

echo.
echo Application started:
echo - Backend: http://localhost:8081/api
echo - Frontend: http://localhost:3000
echo.
echo You can now use the application! Open your browser at http://localhost:3000
echo. 