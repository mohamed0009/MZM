@echo off
echo ========================================
echo PharmaFlow - Lancement du frontend
echo ========================================

echo Configuration de l'environnement...
set NEXT_PUBLIC_API_URL=http://localhost:8080/api

echo Vérification de la connexion au backend...
curl -s -o nul -w "%%{http_code}" http://localhost:8080/api/test/echo > temp.txt
set /p STATUS=<temp.txt
del temp.txt

if "%STATUS%"=="200" (
  echo [OK] Backend connecté et opérationnel.
) else (
  echo [AVERTISSEMENT] Le backend ne semble pas accessible.
  echo Assurez-vous que le serveur Spring Boot est démarré sur le port 8080.
  echo L'application fonctionnera en mode simulation avec des données fictives.
)

echo.
echo Démarrage de l'application frontend...
echo Accédez à http://localhost:3000 dans votre navigateur
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo ========================================

cd frontend && npm run dev 