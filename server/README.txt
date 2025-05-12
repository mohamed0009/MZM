# Running PharmaFlow Backend

## Prerequisites
- Java Development Kit (JDK) 8 or later is required
- Maven 3.6+ (included in this package)

## Steps to Run the Backend

1. **Install JDK 8 or later**
   - Download from Oracle: https://www.oracle.com/java/technologies/downloads/
   - Or use OpenJDK: https://adoptium.net/

2. **Set JAVA_HOME environment variable**
   - Open Command Prompt as Administrator
   - Run: `setx JAVA_HOME "C:\Path\To\Your\JDK"`
   - Run: `setx PATH "%PATH%;%JAVA_HOME%\bin"`
   - Close and reopen your command prompt

3. **Alternative: Use the extracted JDK**
   - A JDK has been downloaded and extracted in the `jdk` folder
   - Run these commands in PowerShell:
     ```
     $env:JAVA_HOME="$PWD\jdk\jdk-18.0.2.1"
     $env:PATH="$env:JAVA_HOME\bin;$env:PATH"
     ```

4. **Run the application**
   - Navigate to the server directory
   - Run: `.\maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run`

5. **Test the application**
   - Once running, test with: `curl http://localhost:8080/api/test/echo`
   - The server will be available at http://localhost:8080
   
## Debugging

To run with remote debugging enabled:
```
.\maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

Connect to port 5005 with your Java IDE. 