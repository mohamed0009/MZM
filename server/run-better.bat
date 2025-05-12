@echo off
echo Setting Java home...
set "JAVA_HOME=%CD%\jdk\jdk-18.0.2.1"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Compiling improved backend...
"%JAVA_HOME%\bin\javac.exe" BetterMock.java

echo Starting improved backend...
"%JAVA_HOME%\bin\java.exe" BetterMock 