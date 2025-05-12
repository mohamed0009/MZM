@echo off
echo Setting Java home...
set "JAVA_HOME=%CD%\jdk\jdk-18.0.2.1"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Building PharmaFlow backend server...
"%CD%\maven\apache-maven-3.9.6\bin\mvn.cmd" clean package -DskipTests

echo Build complete!
pause 