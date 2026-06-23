# Quick Start Guide

## ⚡ 30-Second Summary

A production-quality full-stack CSV user management application with:
- **Backend:** NestJS + TypeScript + PostgreSQL
- **Frontend:** React + Vite + TypeScript  
- **Infrastructure:** Docker + Docker Compose

## 🚀 Getting Started

### Option 1: Docker (Recommended)

```bash
# From root directory
docker-compose up --build

# Access the app:
# - Frontend: http://localhost
# - Backend API: http://localhost:3001
# - Swagger Docs: http://localhost:3001/api
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend
npm install
npm run dev
# Backend runs at http://localhost:3001
```

#### Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

#### Database Setup
```bash
# Create PostgreSQL database
createdb csv_users

# Or use Docker:
docker run -d \
  -e POSTGRES_DB=csv_users \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

## 📁 Project Structure

```
CSV/
├── backend/              # NestJS API
│   ├── src/users/       # User management module
│   ├── src/common/      # Shared exceptions, filters
│   ├── test/            # Unit & E2E tests
│   └── package.json     # Dependencies
├── frontend/            # React + Vite
│   ├── src/components/  # React components
│   ├── src/services/    # API client
│   └── package.json     # Dependencies
├── docker-compose.yml   # Container orchestration
├── .env.example         # Environment template
└── README.md            # Full documentation
```

## 🔧 Environment Setup

Create `.env` file in root and backend:

**Root .env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=csv_users
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

**Frontend .env (optional):**
```env
VITE_API_URL=http://localhost:3001
```

## 📋 Key Features

### API Endpoints

- **POST /users** - Create a user
- **GET /users** - List all users (sorted by date DESC)
- **POST /users/import-csv** - Import users from CSV file

### CSV Import Features

- ✅ Fail-safe processing (errors don't stop other rows)
- ✅ Duplicate detection (CSV & database)
- ✅ Email validation
- ✅ Detailed error reporting with row numbers
- ✅ Summary statistics

### Frontend

- ✅ Single user creation form
- ✅ CSV upload with file picker
- ✅ Sample CSV download
- ✅ User list display
- ✅ Import results with error table
- ✅ Auto-refresh after operations

## 🧪 Testing

```bash
# Backend
cd backend
npm test              # Run unit + E2E tests
npm run test:watch   # Watch mode
npm run test:cov     # Coverage report

# Frontend
cd frontend
npm test             # Run component tests
npm run test:watch   # Watch mode
```

## 📖 CSV Format

```csv
username,email
kamil_T,kamil@pl.com
katia_R,katia@pl.com
```

**Validation Rules:**
- Both columns required (username, email)
- Email must be valid format
- No duplicate emails
- Whitespace auto-trimmed
- Blank lines skipped

## 🔍 Swagger Documentation

When backend is running, visit:
- **Local:** http://localhost:3001/api
- **Docker:** http://localhost:3001/api

## 📝 Common Commands

```bash
# Build production
npm run build

# Start production server
npm start

# Linting
npm run lint

# TypeScript check
npx tsc --noEmit

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001 (backend)
lsof -i :3001
kill -9 <PID>

# Kill process on port 5173 (frontend)
lsof -i :5173
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres

# Docker check
docker ps
```

### Docker Issues
```bash
# Clean rebuild
docker-compose down -v
docker-compose up --build

# View detailed logs
docker-compose logs -f

# Stop all containers
docker-compose down
```

## 📚 Full Documentation

See **README.md** for:
- Architecture details
- Complete API documentation
- Database schema
- Setup instructions (detailed)
- CSV validation rules
- Testing guide
- Future improvements
- Assumptions

## 🎯 Next Steps

1. **Run the application** (Docker or local)
2. **Create a user** via the form
3. **Download sample CSV** from the app
4. **Import users** via CSV upload
5. **View results** in the users list

## 📧 Sample User Data

**Form Entry:**
- Username: `kamil_T`
- Email: `kamil@pl.com`

**CSV Sample:**
```csv
username,email
alice_wonder,alice@pl.com
bob_builder,bob@pl.com
charlie_brown,charlie@pl.com
```

## ✨ Key Technologies

- **NestJS** - Enterprise Node.js framework
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **Vite** - Lightning-fast build tool
- **PostgreSQL** - Relational database
- **TypeORM** - Object-relational mapper
- **Axios** - HTTP client
- **Jest** - Testing framework
- **Docker** - Containerization

---

**For detailed documentation, see README.md**

**Questions? Check the README.md for comprehensive guides.**
