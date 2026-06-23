# CSV User Management Application

A production-quality full-stack application for user management with CSV import functionality. Built with NestJS, React, TypeScript, and PostgreSQL.

## Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
  - [Local Development](#local-development)
  - [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [CSV Format](#csv-format)
- [Testing](#testing)
- [Database](#database)
- [Assumptions](#assumptions)
- [Future Improvements](#future-improvements)

## Architecture

### Tech Stack

**Backend:**
- **Runtime:** Node.js 18+
- **Framework:** NestJS 10
- **Language:** TypeScript 5 (strict mode)
- **Database:** PostgreSQL 15
- **ORM:** TypeORM
- **API Documentation:** Swagger/OpenAPI
- **Validation:** class-validator, class-transformer
- **CSV Processing:** csv-parse

**Frontend:**
- **Framework:** React 19
- **Build Tool:** Vite 8
- **Language:** TypeScript 6
- **HTTP Client:** Axios
- **Testing:** Jest + React Testing Library
- **UI:** CSS-in-JS (React styles)

### Design Principles

1. **Clean Architecture:** Separation of concerns with distinct layers (controllers, services, DTOs)
2. **SOLID Principles:** Single responsibility, dependency injection, interface segregation
3. **Type Safety:** Full TypeScript coverage with strict mode enabled
4. **Fail-Safe CSV Processing:** Each row is processed independently; errors don't stop other rows
5. **Validation at Multiple Levels:** DTO validation + service-level validation
6. **Production-Ready Error Handling:** Meaningful error messages, proper HTTP status codes
7. **Component Composition:** Reusable React components with clear responsibilities

## Project Structure

```
CSV/
├── backend/
│   ├── src/
│   │   ├── common/
│   │   │   ├── exceptions/        # Custom exception classes
│   │   │   └── filters/           # Global exception filters
│   │   ├── users/
│   │   │   ├── controllers/       # Route handlers
│   │   │   ├── services/          # Business logic
│   │   │   ├── dto/               # Data transfer objects
│   │   │   ├── entities/          # Database entities
│   │   │   └── interfaces/        # TypeScript interfaces
│   │   ├── migrations/            # Database migrations
│   │   ├── app.module.ts          # Root module
│   │   └── main.ts                # Application entry
│   ├── test/                      # Unit and E2E tests
│   ├── package.json               # Dependencies and scripts
│   ├── tsconfig.json              # TypeScript config
│   ├── jest.config.json           # Jest configuration
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── UserForm.tsx
│   │   │   ├── CsvImport.tsx
│   │   │   ├── UserList.tsx
│   │   │   └── ImportResults.tsx
│   │   ├── pages/                 # Page components
│   │   │   └── Home.tsx
│   │   ├── services/              # API client
│   │   │   └── api.ts
│   │   ├── types/                 # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx                # Root component
│   │   └── main.tsx               # Entry point
│   ├── public/                    # Static assets
│   ├── package.json               # Dependencies and scripts
│   ├── tsconfig.json              # TypeScript config
│   ├── jest.config.json           # Jest configuration
│   ├── vite.config.ts             # Vite configuration
│   ├── nginx.conf                 # Nginx config for Docker
│   └── .gitignore
│
├── backend.Dockerfile            # Backend Docker image
├── frontend.Dockerfile           # Frontend Docker image
├── docker-compose.yml            # Docker Compose configuration
├── .env.example                  # Example environment variables
├── .gitignore
└── README.md
```

## Features

### Backend

- **POST /users** - Create a single user with validation
- **GET /users** - List all users sorted by creation date (DESC)
- **POST /users/import-csv** - Import users from a CSV file with multipart/form-data
- **Swagger API Documentation** - Available at `/api`

### CSV Import Features

- **Fail-Safe Processing:** Each row is processed independently; errors in one row don't affect others
- **Comprehensive Validation:**
  - Required fields (username, email)
  - Valid email format
  - Duplicate detection within CSV and against database
  - CSV format validation (headers, content)
- **Detailed Error Reporting:**
  - Row number where error occurred
  - Specific error message
  - Original row data for reference
- **Summary Report:**
  - Total rows processed
  - Successful creations
  - Failed rows with details
  - List of successfully created users

### Frontend

- **Single User Creation Form** with real-time validation
- **CSV Import Interface** with file selection and upload
- **Sample CSV Download** for user reference
- **User List Display** with pagination support (sortable by date)
- **Import Results Display** with error table
- **Loading States** for async operations
- **Auto-Refresh** of user list after operations
- **Type-Safe API Calls** with Axios

## Setup Instructions

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 15+ (for local development) or Docker
- **npm** 9+ (comes with Node.js)

### Local Development

#### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Setup Database

Create PostgreSQL database:

```bash
# Using PostgreSQL CLI
createdb csv_users

# Or using psql
psql -c "CREATE DATABASE csv_users;"
```

#### 3. Environment Configuration

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Update `.env` with your settings:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=csv_users
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

Create `.env` in the frontend directory:

```env
VITE_API_URL=http://localhost:3001
```

#### 4. Run Migrations

```bash
cd backend
npm run build
```

Then run migrations:

```bash
npm run typeorm migration:run
```

(Migrations are configured in `src/app.module.ts` with `synchronize: false` for production safety)

#### 5. Start Development Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend will start at `http://localhost:3001`
API docs available at `http://localhost:3001/api`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will start at `http://localhost:5173`

### Docker Setup

#### Prerequisites

- Docker 20+
- Docker Compose 2+

#### Quick Start

```bash
# From the root directory
docker-compose up --build
```

This will:
- Create and start PostgreSQL database
- Build and start the backend service
- Build and start the frontend service (Nginx)

Services will be available at:
- **Frontend:** http://localhost
- **Backend API:** http://localhost:3001
- **Swagger Docs:** http://localhost:3001/api

#### Build Individual Images

```bash
# Build backend
docker build -f backend.Dockerfile -t csv-backend .

# Build frontend
docker build -f frontend.Dockerfile -t csv-frontend .
```

#### Development with Docker

For development with hot-reload:

```bash
# Edit docker-compose.yml to mount volumes:
# backend:
#   volumes:
#     - ./backend/src:/app/src

docker-compose up
```

#### Stop Services

```bash
docker-compose down

# Remove volumes (database data)
docker-compose down -v
```

## API Documentation

### Base URL

- **Local:** `http://localhost:3001`
- **Docker:** `http://localhost:3001`

All responses are JSON. Error responses include `statusCode`, `message`, and `error` fields.

### Endpoints

#### Create User

```
POST /users
Content-Type: application/json

Request Body:
{
  "username": "kamil_T",
  "email": "kamil@pl.com"
}

Response (201 Created):
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "username": "kamil_T",
  "email": "kamil@pl.com",
  "createdAt": "2024-01-15T10:30:00.000Z"
}

Error (400 Bad Request):
{
  "statusCode": 400,
  "message": "Email must be valid",
  "error": "Bad Request"
}

Error (409 Conflict):
{
  "statusCode": 409,
  "message": "Email 'kamil@pl.com' already exists",
  "error": "Conflict"
}
```

#### List Users

```
GET /users

Response (200 OK):
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "kamil_T",
    "email": "kamil@pl.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174001",
    "username": "katia_R",
    "email": "katia@pl.com",
    "createdAt": "2024-01-15T09:15:00.000Z"
  }
]
```

#### Import CSV

```
POST /users/import-csv
Content-Type: multipart/form-data

Request:
- file: CSV file (multipart file upload)

Response (201 Created):
{
  "totalRows": 3,
  "successCount": 2,
  "failureCount": 1,
  "createdUsers": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "username": "kamil_T",
      "email": "kamil@pl.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "username": "katia_R",
      "email": "katia@pl.com",
      "createdAt": "2024-01-15T10:31:00.000Z"
    }
  ],
  "errors": [
    {
      "rowNumber": 3,
      "error": "Email 'invalid@pl.com' already exists",
      "data": {
        "username": "bob_jones",
        "email": "invalid@pl.com"
      }
    }
  ]
}

Error (400 Bad Request):
{
  "statusCode": 400,
  "message": "File must be a CSV file",
  "error": "Bad Request"
}
```

### Swagger/OpenAPI

Interactive API documentation is available at `/api` when the backend is running.

## CSV Format

### Valid CSV Structure

```csv
username,email
kamil_T,kamil@pl.com
katia_R,katia@pl.com
bob_jones,bob@pl.com
```

### Column Requirements

| Column | Required | Format | Validation |
|--------|----------|--------|-----------|
| `username` | Yes | String | Min 1 character, max 255 |
| `email` | Yes | String | Valid email format, max 255 |

### CSV Validation Rules

1. **Headers:** File must have `username` and `email` columns (case-sensitive)
2. **Required Fields:** Both username and email must be present for each row
3. **Email Format:** Valid RFC 5322 email format
4. **Duplicates:** No duplicate emails within the same CSV or against the database
5. **Whitespace:** Leading/trailing whitespace is automatically trimmed
6. **Empty Lines:** Blank rows are skipped
7. **File Format:** Must be a valid CSV file with `.csv` extension

### CSV Examples

#### Valid CSV

```csv
username,email
kamil_T,kamil@pl.com
katia_R,katia.R@example.co.uk
alice_wonderland,alice+work@pl.com
```

#### Invalid CSV (with errors)

```csv
username,email
kamil_T,kamil@pl.com
,missing_username@pl.com            # Row 3: Missing username
katia_R,invalid.email                 # Row 4: Invalid email format
bob_jones,kamil@pl.com               # Row 5: Duplicate email
```

### Handling Errors

The API processes all rows and returns a detailed error report. Each error includes:
- **rowNumber:** The row in the CSV where the error occurred
- **error:** Description of what went wrong
- **data:** Original row data for reference

Example error response:

```json
{
  "totalRows": 5,
  "successCount": 2,
  "failureCount": 3,
  "createdUsers": [...],
  "errors": [
    {
      "rowNumber": 3,
      "error": "Username is required",
      "data": {"username": "", "email": "user@pl.com"}
    },
    {
      "rowNumber": 4,
      "error": "Email must be valid",
      "data": {"username": "katia", "email": "invalid.email"}
    },
    {
      "rowNumber": 5,
      "error": "Email 'kamil@pl.com' already exists",
      "data": {"username": "duplicate", "email": "kamil@pl.com"}
    }
  ]
}
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

**Test Files:**
- `test/users.service.spec.ts` - Unit tests for UsersService
- `test/users.e2e.spec.ts` - E2E tests for API endpoints

**Coverage:**
- CSV parsing and validation
- Duplicate detection
- Error handling
- API endpoints

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

**Test Files:**
- `src/components/UserForm.test.tsx` - UserForm component tests

**Coverage:**
- Form validation
- API integration
- Error display
- Success messages

## Database

### Schema

**users table:**

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| username | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

### Migrations

Migrations are stored in `backend/src/migrations/` and run automatically on startup.

To manually run migrations:

```bash
cd backend
npm run typeorm migration:run
```

To revert the latest migration:

```bash
npm run typeorm migration:revert
```

### Indexes

- **email:** For fast unique constraint checks and lookups
- **createdAt:** For efficient sorting in list queries

## Assumptions

1. **Single Deployment:** The application assumes a single instance deployment initially (no distributed tracing/logging needed)
2. **Email Uniqueness:** Email addresses are treated as globally unique identifiers
3. **UTC Timestamps:** All timestamps are stored in UTC
4. **No Authentication:** Currently no user authentication/authorization (recommended for future enhancement)
5. **In-Memory User Cache:** No caching layer (CSV import holds existing emails in memory for performance)
6. **Synchronous Processing:** CSV import is processed synchronously (acceptable for moderate file sizes)
7. **UTF-8 Encoding:** Assumes CSV files are UTF-8 encoded
8. **HTTP Only:** No HTTPS/TLS setup in base configuration (add in production)

## Future Improvements

### Backend

1. **Pagination:** Add pagination to GET /users endpoint
2. **Filtering & Search:** Support filtering users by email, username, date range
3. **Authentication:** JWT-based authentication and authorization
4. **Async CSV Processing:** Use job queues (Bull, RabbitMQ) for large file imports
5. **File Upload Limits:** Enforce maximum file size for CSV uploads
6. **Batch Operations:** Update/delete operations for multiple users
7. **Audit Logging:** Track all user operations with timestamps and user IDs
8. **Rate Limiting:** Implement rate limiting on API endpoints
9. **Database Connection Pooling:** Optimize with connection pool configuration
10. **Caching:** Redis caching for frequently accessed user lists

### Frontend

1. **Pagination UI:** Display users with pagination controls
2. **Advanced Filtering:** Search and filter by username/email/date
3. **Bulk Upload Progress:** Progress bar for CSV upload status
4. **Data Export:** Export users to CSV
5. **User Editing:** Edit existing user information
6. **User Deletion:** Soft/hard delete functionality
7. **Responsive Design:** Mobile-first UI improvements
8. **Dark Mode:** Theme switching capability
9. **Form Validation UX:** Real-time field validation feedback
10. **Internationalization:** Multi-language support

### Infrastructure

1. **Kubernetes:** Deploy to K8s with proper service mesh
2. **CI/CD Pipeline:** GitHub Actions for automated testing and deployment
3. **Monitoring:** Prometheus metrics and Grafana dashboards
4. **Logging:** ELK stack or similar centralized logging
5. **SSL/TLS:** HTTPS/TLS certificates
6. **Load Balancing:** Nginx/HAProxy for load distribution
7. **Database Backups:** Automated backup and disaster recovery
8. **Environment Management:** Separate dev/staging/production environments
9. **Secret Management:** HashiCorp Vault or similar
10. **API Versioning:** Version APIs for backward compatibility

### Code Quality

1. **E2E Tests:** Cypress or Playwright for full user flow testing
2. **Integration Tests:** More comprehensive integration test coverage
3. **Performance Testing:** Load and stress testing
4. **Documentation:** API documentation in OpenAPI 3.0
5. **Code Review:** GitHub/GitLab code review workflows
6. **Static Analysis:** SonarQube for code quality metrics
7. **Dependency Scanning:** Regular dependency vulnerability checks

## Development Guidelines

### Code Style

- Use TypeScript strictly (no `any` types)
- Follow NestJS/React best practices
- ESLint configuration enforces style rules
- Use meaningful variable and function names

### Commit Messages

Format: `[type](scope): description`

Examples:
- `feat(users): add CSV import endpoint`
- `fix(validation): improve email validation`
- `docs(readme): update setup instructions`
- `test(users): add CSV parsing tests`

### Branch Naming

- `feature/feature-name`
- `fix/issue-name`
- `refactor/component-name`
- `test/test-description`

## License

MIT

## Support

For issues or questions, please open an issue in the repository.

---

**Last Updated:** January 2024
**Version:** 1.0.0
