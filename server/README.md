# PharmaFlow Backend Server

PharmaFlow is a pharmacy management system that helps pharmacies manage inventory, clients, and sales efficiently.

## Features

- User authentication with JWT
- Role-based access control (Admin, Pharmacist, User)
- Inventory management
- Client management
- RESTful API

## Prerequisites

- Java Development Kit (JDK) 8 or later
- Maven 3.6+

## Quick Start

We've provided several batch scripts to make it easy to run the application:

1. To run using the embedded standalone mock server:
   ```
   run-enhanced.bat
   ```

2. To run an alternative mock implementation:
   ```
   run-better.bat
   ```

3. To build the complete Spring Boot server:
   ```
   build-server.bat
   ```

4. To run the compiled Spring Boot server:
   ```
   run-server.bat
   ```

## API Endpoints

### Authentication
- POST `/api/auth/login` - Authenticate a user
- POST `/api/auth/register` - Register a new user

### Test/Debug
- GET `/api/test/echo` - Test if the server is running

### Inventory
- GET `/api/inventory` - Get all products
- POST `/api/inventory` - Add a new product
- GET `/api/inventory/{id}` - Get product by ID
- PUT `/api/inventory/{id}` - Update product
- DELETE `/api/inventory/{id}` - Delete product

### Clients
- GET `/api/clients` - Get all clients
- POST `/api/clients` - Add a new client
- GET `/api/clients/{id}` - Get client by ID
- PUT `/api/clients/{id}` - Update client
- DELETE `/api/clients/{id}` - Delete client

## Default Users

The system initializes with the following default user:

- Admin: 
  - Username: admin
  - Email: admin@pharmaflow.com
  - Password: Admin123!

## Development

### Project Structure

- `/src/main/java/com/mzm/pharmaflow` - Java source code
  - `/config` - Configuration classes
  - `/controller` - REST controllers
  - `/dto` - Data Transfer Objects
  - `/model` - Entity models
  - `/repository` - Data repositories
  - `/security` - Security configuration

- `/src/main/resources` - Configuration files
  
### Technology Stack

- Spring Boot 2.7.x
- Spring Security
- Spring Data JPA
- H2 Database (in-memory)
- JWT Authentication

## Database

The application uses an H2 in-memory database by default. The database console is available at:
http://localhost:8080/api/h2-console

Database credentials:
- JDBC URL: `jdbc:h2:mem:pharmaflow`
- Username: `sa`
- Password: `password` 