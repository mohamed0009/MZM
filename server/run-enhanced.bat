@echo off
echo Setting Java home...
set "JAVA_HOME=%CD%\jdk\jdk-18.0.2.1"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Compiling enhanced backend...
"%JAVA_HOME%\bin\javac.exe" EnhancedMock.java

echo Starting enhanced backend...
"%JAVA_HOME%\bin\java.exe" EnhancedMock 