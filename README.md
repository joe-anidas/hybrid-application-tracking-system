# Hybrid Application Tracking System

A comprehensive MERN stack application tracking system with role-based authentication and automation capabilities.

## Features Implemented ✅

### 1. Role-Based Authentication & Dashboards
- **JWT-based Authentication** with username/email and password
- **Three User Roles:**
  - **Applicant** - Can create and track own applications
  - **Bot Mimic** - Performs automated updates for technical roles only
  - **Admin** - Manages non-technical applications manually & creates job postings
- **Role-specific Dashboards** with charts, cards, and statistics
- **Access Control** - Each role can only see and act on applications relevant to them

## Architecture

### Backend (Node.js + Express + MongoDB)
```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
│   └── authController.js
├── middleware/       # Custom middleware
│   └── auth.js       # JWT auth & role-based authorization
├── models/          # MongoDB schemas
│   └── User.js      # User model with roles
├── routes/          # API routes
│   ├── authRoutes.js      # Authentication endpoints
│   └── dashboardRoutes.js # Dashboard data endpoints
└── server.js        # Main server file
```

### Frontend (React + Vite + Tailwind)
```
frontend/src/
├── contexts/        # React contexts
│   └── AuthContext.jsx
├── pages/           # Page components
│   ├── Admin.jsx           # Admin dashboard
│   ├── ApplicantDashboard.jsx
│   ├── BotMimicDashboard.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Register.jsx
└── services/        # API services
    ├── auth.js      # Authentication API
    └── dashboard.js # Dashboard data API
```

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### 1. Clone and Setup Backend

```bash
# Clone the repository
git clone <repository-url>
cd hybrid-application-tracking-system

# Setup backend
cd backend
npm install

# Create .env file
cp .env.example .env

# Start MongoDB (if running locally)
mongod

# Load demo data (ONE TIME ONLY - skip if data already exists)
npm run load-data

# Start backend server
npm start
# Server will run on http://localhost:3000
```

**Note:** The demo data loading is now a **separate step** and should only be run once during initial setup or when you want to refresh the database.

### 2. Setup Frontend

```bash
# In a new terminal, navigate to frontend
cd frontend
npm install

# Start frontend development server
npm run dev
# Frontend will run on http://localhost:5173
```

### 3. Access the Application

1. Open http://localhost:5173 in your browser
2. **Option A - Use Demo Accounts:** Click the login button and use the pre-created demo credentials displayed on the login page
3. **Option B - Register New Account:** Register a new account and select your role:
   - **Applicant**: For job seekers
   - **Bot Mimic**: For automated system simulation
   - **Admin**: For HR/management
4. You'll be automatically redirected to your role-specific dashboard

### 🚀 Quick Demo
- **Login Page:** http://localhost:5173/login (demo credentials auto-displayed)
- **Admin Dashboard:** Use `admin@demo.com` / `admin123`
- **Bot Mimic Dashboard:** Use `bot@demo.com` / `bot123`
- **Applicant Dashboard:** Use `applicant@demo.com` / `applicant123`

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user with role selection.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "Applicant" // Optional: "Applicant", "Bot Mimic", or "Admin"
}
```

**Response:**
```json
{
  "message": "Registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Applicant"
  },
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Logged in successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Applicant"
  },
  "token": "jwt_token_here"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Applicant",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Dashboard Endpoints

#### GET /api/dashboard/applicant
Get applicant dashboard data (requires Applicant role).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": { "id": "...", "name": "...", "role": "Applicant" },
  "stats": {
    "totalApplications": 12,
    "pending": 5,
    "interviews": 3,
    "offers": 1,
    "rejections": 3
  },
  "recentActivity": [...]
}
```

#### GET /api/dashboard/bot-mimic
Get bot mimic dashboard data (requires Bot Mimic role).

#### GET /api/dashboard/admin
Get admin dashboard data (requires Admin role).

## Environment Variables

### Backend (.env)
```
# Database
MONGO_URI=mongodb://localhost:27017/hybrid-ats

# JWT Configuration
JWT_SECRET=your_super_secure_secret_key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE=http://localhost:3000/api
```

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **Recharts** - Chart library
- **Lucide React** - Icon library

## Dashboard Features

### Applicant Dashboard
- Application statistics (total, pending, interviews, offers, rejections)
- Status distribution pie chart
- Recent activity timeline
- Mobile-responsive design

### Bot Mimic Dashboard
- Processing statistics (total processed, today's count, technical roles)
- Performance metrics (avg processing time, success rate)
- Real-time activity monitoring
- Automation status indicator

### Admin Dashboard
- System overview (applications, users, job postings)
- Job posting management interface
- Recent administrative activities
- Quick action buttons

## Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **Role-Based Access Control** - Middleware enforces role permissions
3. **Password Hashing** - bcryptjs with salt rounds
4. **Input Validation** - Server-side validation for all endpoints
5. **Protected Routes** - Frontend route protection based on authentication and roles

## Sample User Credentials

**Demo accounts are automatically created when the server starts. Use these credentials to test different roles:**

### 🔑 Demo Login Credentials

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | `admin@demo.com` | `admin123` | Full administrative capabilities |
| **Bot Mimic** | `bot@demo.com` | `bot123` | Automation monitoring and control |
| **Applicant** | `applicant@demo.com` | `applicant123` | Personal application tracking |

**Quick Login:** Demo credentials are displayed on the login page - just click any credential to auto-fill the form!

## Data Management

### Loading Demo Data

Demo data loading is now a **separate, manual process** and does not run automatically when the server starts.

#### Load Demo Data (Initial Setup)
```bash
cd backend
npm run load-data
```

This will create:
- ✅ 7 Demo Users (1 Admin, 1 Bot Mimic, 5 Applicants)
- ✅ 8 Demo Jobs (4 Technical, 4 Non-Technical)
- ✅ 5 Applicant Profiles (with complete information)
- ✅ 10 Demo Applications (various statuses)

#### When to Load Data
- **First time setup** - After installing the backend
- **After database reset** - If you cleared the database
- **Refreshing demo data** - To restore or update demo data

#### Benefits of Separate Loading
- 🚀 **Fast Server Startup** - No seeding delay on every restart
- 🎯 **Intentional Control** - Load data only when needed
- 🔒 **Production Safe** - No accidental data seeding
- 🧪 **Better Testing** - Clean slate for each test run

For detailed information, see [`backend/DATA_LOADING.md`](backend/DATA_LOADING.md)

## Development

### Code Structure
- **Modular Design** - Separate concerns with clear file organization
- **Reusable Components** - Shared UI components and utilities
- **Clean Architecture** - Separation of routes, controllers, and models
- **Consistent Styling** - Tailwind CSS utility classes throughout

### API Design
- **RESTful Endpoints** - Standard HTTP methods and status codes
- **Consistent Response Format** - Standardized JSON responses
- **Error Handling** - Comprehensive error messages and status codes
- **Authentication Middleware** - Centralized auth logic

## Future Enhancements

The system is designed to be extensible for the remaining features:

1. **Application Creation & Tracking** - Forms and tracking interfaces
2. **Bot Mimic Automation** - Automated workflow processing
3. **Admin Management Tools** - Job posting creation and management
4. **Full Traceability** - Activity logging and audit trails

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
