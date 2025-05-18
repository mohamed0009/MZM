@echo off
echo Setting Java home...
set "JAVA_HOME=%CD%\jdk\jdk-18.0.2.1"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Starting PharmaFlow backend server...
"%JAVA_HOME%\bin\java.exe" -jar target/pharmaflow-server-0.0.1-SNAPSHOT.jar --server.port=8081 