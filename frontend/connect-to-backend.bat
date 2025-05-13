@echo off
echo Creating environment configuration file...

echo # API Configuration > .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:8080/api >> .env.local
echo # Authentication >> .env.local
echo NEXT_PUBLIC_AUTH_ENABLED=true >> .env.local
echo # Features >> .env.local
echo NEXT_PUBLIC_ENABLE_MOCK_DATA=false >> .env.local

echo Environment file created successfully.
echo Configuration:
echo - API URL: http://localhost:8080/api
echo - Auth enabled: true
echo - Mock data: disabled

echo Starting development server...
npm run dev 