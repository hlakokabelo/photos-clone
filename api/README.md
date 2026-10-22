# Photos Clone API

A REST API built with **Java 21 and Spring Boot 4** for uploading, managing, searching, and downloading photos.

This project was developed to gain hands-on experience with Spring Boot, RESTful API development, Spring Security, JWT authentication, dependency injection, and database operations using PostgreSQL.

## 🚀 Live API

**Base URL:** https://photos-clone-api.onrender.com

**API Documentation:** [View API](https://photos-clone-api.onrender.com/api)

**Swagger UI:** [Explore API](https://photos-clone-api.onrender.com/swagger-ui/index.html)

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [API Endpoints](#api-endpoints)
  - [Filtering Photos](#filtering-photos)
- [Web Interface](#web-interface)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [Deployment](#deployment)
- [Database](#database)
- [CI/CD](#cicd)
- [Project Purpose](#project-purpose)

## Tech Stack

- **Backend:** Java 21, Spring Boot 4
- **Database:** Neon PostgreSQL, Spring Data JDBC
- **Security:** Spring Security, JWT, BCrypt
- **API Documentation:** Springdoc OpenAPI (Swagger UI)
- **Build Tool:** Gradle
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Frontend:** HTML, CSS, JavaScript (upload interface)

## Features

- User registration and login with JWT authentication
- Secure password hashing using BCrypt
- Upload images up to 5 MB with file type validation
- Upload multiple photos through a browser interface
- Associate uploaded photos with user accounts
- Retrieve individual photos or list all photos
- Search photos by filename and content type
- Limit the number of returned results
- Download photos in their original format
- Delete photos
- File validation and custom HTTP error responses
- Persistent cloud database storage using Neon PostgreSQL
- Interactive API documentation with Swagger UI

## API Endpoints

| Method | Endpoint             | Description                           |
| ------ | -------------------- | ------------------------------------- |
| GET    | `/api`               | API documentation                     |
| POST   | `/api/auth/register` | Register a user                       |
| POST   | `/api/auth/login`    | Authenticate and receive a JWT        |
| GET    | `/api/photos`        | Retrieve photos with optional filters |
| GET    | `/api/photo/{id}`    | Retrieve photo metadata               |
| POST   | `/api/photo`         | Upload a photo (JWT required)         |
| DELETE | `/api/photo/{id}`    | Delete a photo (JWT required)         |
| GET    | `/api/download/{id}` | Download a photo                      |

### Filtering Photos

The `/api/photos` endpoint supports optional query parameters:

| Parameter     | Description                                          |
| ------------- | ---------------------------------------------------- |
| `fileName`    | Filter by filename (case-insensitive, partial match) |
| `contentType` | Filter by MIME type                                  |
| `limit`       | Maximum number of results (default: 1000)            |

Example:

```http
GET /api/photos?fileName=holiday&contentType=image&limit=10
```

## Web Interface

A lightweight browser interface is available for uploading photos individually or in batches.

- **Upload Interface:** [Open Upload Page](https://photos-clone-api.onrender.com/upload.html)
- **Swagger UI:** [Explore API](https://photos-clone-api.onrender.com/swagger-ui/index.html)
- **API Documentation:** [View JSON](https://photos-clone-api.onrender.com/api)

The upload interface sends a separate API request for each selected image and displays individual upload results.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hlakokabelo/photos-clone-api.git
cd photos-clone-api
```

### 2. Configure environment variables

The application uses Neon PostgreSQL as its database.

Create a Neon project at [neon.tech](https://neon.tech) and obtain your database connection details.

Create a `.env` file in the project root:

```env
DB_URL=jdbc:postgresql://your-neon-host/neondb?sslmode=require
DB_USER=your_database_username
DB_PASSWORD=your_database_password
JWT_SECRET=your_base64_encoded_secret
```

Generate a secure JWT secret using:

```bash
openssl rand -base64 32
```

The application reads these values through `application.properties`:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

app.jwt.secret=${JWT_SECRET}

spring.sql.init.mode=always
```

**Important:** Never commit your `.env` file or database credentials to GitHub. Ensure `.env` is included in `.gitignore`.

### 3. Run the application

**Windows:**

```powershell
.\gradlew.bat bootRun
```

**Linux/macOS:**

```bash
./gradlew bootRun
```

Ensure the environment variables are available to the process before running the application. Gradle does not automatically load `.env` files.

When using VS Code, the application can also be launched using the Java debugger with `envFile` configured in `.vscode/launch.json`.

The application will be available at:

http://localhost:8080

## Running with Docker

The application can be packaged and run inside a Docker container.

Build the Docker image:

```bash
docker build -t photos-clone-api .
```

Run the container with the required environment variables:

```bash
docker run --env-file .env -p 8080:8080 photos-clone-api
```

Docker passes the database credentials and JWT secret to the application at runtime.

The PostgreSQL database is hosted externally on Neon, so a separate database container is not required.

Ensure `.env` is also excluded from the Docker build context through `.dockerignore`.

## Deployment

The API is deployed on Render using Docker.

The application is built from the repository's Dockerfile and connects to a Neon-hosted PostgreSQL database.

Environment variables are configured securely in Render.

## Database

The application uses **Neon PostgreSQL** with **Spring Data JDBC** for database operations.

The database stores:

- User accounts and BCrypt password hashes
- Photo metadata, including filenames and content types
- Uploaded image data using PostgreSQL's `BYTEA` type
- Photo ownership information through user IDs

The database schema is defined in `src/main/resources/schema.sql` and initialized through Spring Boot's SQL initialization configuration.

Unlike an in-memory H2 database, Neon provides persistent cloud-hosted storage, allowing application data to remain available across application restarts.

Database credentials are managed through environment variables rather than being hardcoded in the application.

## CI/CD

GitHub Actions automatically builds the project using Gradle on pushes and pull requests to the `main` branch.

The workflow helps verify that the application compiles and passes its configured tests.

## Project Purpose

This project serves as a practical introduction to the Spring ecosystem, focusing on REST API design, authentication, persistence, validation, and backend application architecture.

It also provides experience with cloud-hosted PostgreSQL, environment-based configuration, Docker containerization, and automated builds using GitHub Actions.
