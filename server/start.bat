@echo off
TITLE PharmaFlow Server Launcher
COLOR 0A

:MENU
CLS
ECHO.
ECHO =============================================
ECHO           PHARMAFLOW SERVER LAUNCHER
ECHO =============================================
ECHO.
ECHO 1 - Run Enhanced Mock Server
ECHO 2 - Run Better Mock Server
ECHO 3 - Build and Run Spring Boot Server
ECHO 4 - Run Spring Boot Server (if already built)
ECHO 5 - Exit
ECHO.
ECHO =============================================
ECHO.

SET /P M=Type 1, 2, 3, 4 or 5 then press ENTER: 

IF %M%==1 GOTO ENHANCED
IF %M%==2 GOTO BETTER
IF %M%==3 GOTO BUILD
IF %M%==4 GOTO SERVER
IF %M%==5 GOTO EOF

:ENHANCED
ECHO.
ECHO Starting Enhanced Mock Server...
ECHO.
CALL run-enhanced.bat
GOTO MENU

:BETTER
ECHO.
ECHO Starting Better Mock Server...
ECHO.
CALL run-better.bat
GOTO MENU

:BUILD
ECHO.
ECHO Building and Running Spring Boot Server...
ECHO.
CALL build-server.bat
CALL run-server.bat
GOTO MENU

:SERVER
ECHO.
ECHO Running Spring Boot Server...
ECHO.
CALL run-server.bat
GOTO MENU

:EOF
EXIT 