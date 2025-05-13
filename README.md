# PharmaFlow - Système de Gestion de Pharmacie

PharmaFlow est une application complète de gestion de pharmacie qui permet de gérer les produits, les clients, les prescriptions et les ventes.

## Architecture

L'application est composée de deux parties principales :

1. **Frontend** : Une application React/Next.js avec une interface utilisateur moderne et réactive
2. **Backend** : Une API REST développée avec Spring Boot (Java) qui gère les données et la logique métier

## Fonctionnalités

- Tableau de bord avec statistiques et graphiques
- Gestion des produits (médicaments)
- Gestion des clients
- Gestion des prescriptions
- Gestion des ventes
- Alertes de stock et d'expiration
- Rapports et statistiques

## Prérequis

- Node.js 16+ et npm
- Java 8+ et Maven
- MySQL ou H2 (base de données)

## Installation

### Backend

1. Naviguez vers le dossier du serveur :
   ```
   cd server
   ```

2. Compilez le projet avec Maven :
   ```
   mvn clean install
   ```

3. Lancez le serveur :
   ```
   mvn spring-boot:run
   ```

Le serveur backend sera accessible à l'adresse http://localhost:8080/api

### Frontend

1. Naviguez vers le dossier frontend :
   ```
   cd frontend
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Lancez le serveur de développement :
   ```
   npm run dev
   ```

Le frontend sera accessible à l'adresse http://localhost:3000

### Lancement rapide

Pour un démarrage rapide, vous pouvez utiliser le script `connect-to-backend.bat` (Windows) qui configure et lance automatiquement le frontend avec les bonnes variables d'environnement.



## Pages principales

- `/` - Page d'accueil
- `/dashboard` - Tableau de bord principal
- `/inventory` - Gestion des produits
- `/clients` - Gestion des clients
- `/prescriptions` - Gestion des prescriptions
- `/sales` - Gestion des ventes
- `/api-test` - Outil de test de l'API

## Développement

### Structure du projet

- `/frontend` - Code source du frontend (Next.js)
- `/server` - Code source du backend (Spring Boot)

### Variables d'environnement

Frontend :
- `NEXT_PUBLIC_API_URL` - URL de l'API backend (par défaut : http://localhost:8080/api)

Backend :
- `SPRING_DATASOURCE_URL` - URL de la base de données
- `SPRING_DATASOURCE_USERNAME` - Nom d'utilisateur de la base de données
- `SPRING_DATASOURCE_PASSWORD` - Mot de passe de la base de données

## Licence

Ce projet est sous licence MIT.

## Auteurs

- MZM Team 