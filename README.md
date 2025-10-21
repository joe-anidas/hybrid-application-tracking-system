# Hybrid Application Tracking System

A comprehensive full-stack application tracking system that handles both automated (technical roles) and manual (non-technical roles) application workflows with complete audit trails and role-based access control.

## 🚀 Features Available

### 1. **Role-Based Authentication & Authorization**
- **JWT-based Authentication** - Secure login with username/email and password
- **Three User Roles:**
  - **Applicant** - Submit and track job applications
  - **Bot Mimic** - Automated processing of technical role applications
  - **Admin** - Full system management and manual application processing
- **Protected Routes** - Role-based access control across all endpoints
- **User Profile Management** - View and manage user information
- **Secure Password Storage** - bcryptjs password hashing

### 2. **Job Management System**
- **Create Job Postings** (Admin only):
  - Full job details: title, department, location, description
  - Technical vs Non-technical role classification
  - Employment type: full-time, part-time, contract
  - Job levels: entry, mid, senior, lead, executive
  - Salary range specification
  - Skills and requirements listing
  - Application deadlines
  - Benefits information
  - Job responsibilities
- **Browse & Search Jobs**:
  - Filter by job type (technical/non-technical)
  - Filter by department
  - Filter by status (active/closed)
  - Pagination support for large datasets
  - Public access (no login required)
- **Job Details View** - Comprehensive job posting information
- **Update & Delete Jobs** (Admin only)

### 3. **Application Submission & Tracking**
- **Apply to Jobs**:
  - Resume upload (PDF, DOC, DOCX - max 5MB)
  - Cover letter submission
  - Why interested statement
  - Relevant experience details
  - Expected salary and start date
  - Duplicate application prevention
- **Application Status Tracking**:
  - Real-time status updates
  - Status stages: Applied → Screening → Reviewed → Interview → Assessment → Offer/Rejected
  - Complete history of all status changes
  - Comments and notes on each update
  - Timestamp tracking for all activities
- **My Applications** - Applicants view all their submitted applications
- **Application Details** - Comprehensive view including:
  - Job information
  - Application details
  - Applicant profile
  - Status history
  - Comments timeline

### 4. **Bot Mimic - Automated Processing**
- **Automated Technical Role Processing**:
  - Simulates API-based automated workflow
  - Automatic status progression through defined stages
  - Scheduled or on-demand processing
  - Only processes technical role applications
  - Ignores non-technical applications
- **Smart Workflow Stages**:
  - Applied → Screening → Reviewed → Interview → Technical Assessment → Offer/Rejected
  - Random success/rejection simulation
  - Realistic processing delays
- **Activity Logging**:
  - Timestamped updates for every action
  - Automated comments for each status change
  - Bot Mimic attribution for transparency
  - Complete audit trail
- **Processing Statistics**:
  - Total applications processed
  - Success/failure rates
  - Processing time metrics
  - Daily processing counts

### 5. **Admin Dashboard & Management**
- **Application Management**:
  - View all applications across all jobs
  - Filter by status, job type, and applicant
  - Manual status updates for non-technical applications
  - Add comments and notes to any application
  - Search by applicant name or email
  - Pagination for efficient browsing
- **Application Review Interface**:
  - Comprehensive application details
  - Applicant profile information
  - Resume download capability
  - Status update with comment addition
  - Complete activity history view
- **Job Management**:
  - Create new job postings
  - Update existing jobs
  - Close/activate job postings
  - View application statistics per job
  - Delete job postings
- **User Management**:
  - View all system users
  - Monitor user roles and access
  - User activity tracking

### 6. **Analytics & Reporting Dashboard**
- **Application Metrics**:
  - Total applications count
  - Applications by status distribution
  - Applications by job type (technical vs non-technical)
  - Recent application trends
- **Visual Analytics** (using Recharts):
  - Interactive pie charts for status distribution
  - Bar charts for job type analysis
  - Line charts for application trends
  - Real-time data visualization
  - Responsive chart designs
- **Status Breakdown**:
  - Applied, Screening, Reviewed, Interview, Assessment, Offer, Rejected counts
  - Percentage calculations
  - Success rate metrics
- **Job Statistics**:
  - Total active jobs
  - Applications per job
  - Average applications per posting

### 7. **Complete Audit Trail & Logging**
- **Activity Tracking**:
  - Every application action logged
  - User attribution (Applicant/Admin/Bot Mimic)
  - Timestamp for all activities
  - Before/after state tracking
  - IP address logging
  - User agent tracking
- **Audit Log Viewing** (Admin only):
  - Filter by action type (CREATE, UPDATE, DELETE, LOGIN, LOGOUT)
  - Filter by resource type (Application, Job, User, etc.)
  - Filter by specific user
  - Date range filtering
  - Pagination support
  - Export capabilities
- **Comprehensive Tracking**:
  - Application status changes
  - Job posting modifications
  - User registrations and logins
  - Comment additions
  - Manual vs automated updates
- **Audit Statistics**:
  - Total audit entries
  - Actions by type
  - Actions by user role
  - Activity timeline

### 8. **Applicant Profile Management**
- **Complete Profile Creation**:
  - Personal information (name, email, phone)
  - Professional summary
  - Skills and expertise listing
  - Education history with degrees
  - Work experience with details
  - Portfolio and LinkedIn links
  - Location information
- **Profile Viewing & Editing**:
  - View own profile
  - Update profile information
  - Profile linked with applications
- **Admin Profile Access**:
  - View applicant profiles during review
  - Complete applicant information for decision-making

### 9. **Application Review System**
- **Admin Review Interface**:
  - Comprehensive application details
  - Full applicant profile view
  - Resume download and viewing
  - One-click status updates
  - Comment/note addition with updates
  - Complete activity history
  - Navigation between applications
- **Review Workflow**:
  - Filter pending applications
  - Bulk application viewing
  - Efficient processing interface
  - Status progression tracking
- **Decision Documentation**:
  - Required comments for status changes
  - Rejection reason tracking
  - Interview feedback notes
  - Offer details documentation

### 10. **Dashboard Features by Role**
- **Applicant Dashboard**:
  - Application statistics overview
  - Recent application status updates
  - Active applications list
  - Profile completion status
  - Quick apply to jobs
  - Application success rate
- **Admin Dashboard**:
  - System-wide metrics and KPIs
  - Pending applications count
  - Total jobs posted
  - Recent activity feed
  - User management access
  - Quick action buttons
  - Application funnel visualization
- **Bot Mimic Dashboard**:
  - Automated processing status
  - Technical applications in queue
  - Processing history
  - Success/failure metrics
  - Manual processing trigger
  - Processing time analytics
  - Activity logs

### 11. **User Management** (Admin)
- **View All Users**:
  - Complete user list with roles
  - Search by name or email
  - Filter by role type
  - Registration date tracking
- **User Information**:
  - Name, email, role
  - Account creation date
  - Last activity tracking
  - Application count per user

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM v8
- **Authentication**: JWT (jsonwebtoken v9)
- **Password Security**: bcryptjs
- **File Upload**: Multer (resume handling)
- **Security**: CORS enabled
- **Development**: Nodemon for hot reload

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 (with @tailwindcss/vite)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios v1.12
- **Charts & Analytics**: Recharts v3
- **Icons**: Lucide React
- **Code Quality**: ESLint 9

## 📁 Project Structure


```
hybrid-application-tracking-system/
├── backend/
│   ├── config/              # Database seeding scripts
│   │   ├── seedDemoData.js
│   │   ├── seedDemoJobs.js
│   │   └── seedDemoUsers.js
│   ├── controllers/         # Route controllers
│   │   └── authController.js
│   ├── middleware/          # Authentication & audit middleware
│   │   ├── auth.js          # JWT verification & role checks
│   │   └── auditMiddleware.js
│   ├── models/              # Mongoose data models
│   │   ├── ApplicantProfile.js
│   │   ├── Application.js
│   │   ├── AuditLog.js
│   │   ├── Job.js
│   │   └── User.js
│   ├── routes/              # API route definitions
│   │   ├── applicationRoutes.js
│   │   ├── auditLogRoutes.js
│   │   ├── authRoutes.js
│   │   ├── botMimicRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── profileRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/             # Resume file storage
│   │   └── resumes/
│   ├── utils/               # Utility functions
│   │   └── auditLogger.js
│   ├── server.js            # Express server entry point
│   ├── load.js              # Data loading script
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   │   └── Footer.jsx
    │   ├── contexts/        # React context providers
    │   │   └── AuthContext.jsx
    │   ├── pages/           # Page components
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AnalyticsDashboard.jsx
    │   │   ├── ApplicantDashboard.jsx
    │   │   ├── ApplicantProfile.jsx
    │   │   ├── ApplicationDetailAdmin.jsx
    │   │   ├── ApplicationReview.jsx
    │   │   ├── AuditLogs.jsx
    │   │   ├── BotMimicDashboard.jsx
    │   │   ├── CreateJob.jsx
    │   │   ├── Home.jsx
    │   │   ├── JobApplication.jsx
    │   │   ├── JobDetails.jsx
    │   │   ├── Jobs.jsx
    │   │   ├── Login.jsx
    │   │   ├── ManageUsers.jsx
    │   │   ├── Register.jsx
    │   │   └── ReviewApplications.jsx
    │   ├── services/        # API service functions
    │   │   ├── applications.js
    │   │   ├── auditLogs.js
    │   │   ├── auth.js
    │   │   ├── botMimic.js
    │   │   ├── dashboard.js
    │   │   ├── jobs.js
    │   │   ├── profile.js
    │   │   └── users.js
    │   ├── App.jsx          # Main app component
    │   ├── main.jsx         # React entry point
    │   └── index.css        # Global styles
    ├── public/              # Static assets
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/joe-anidas/hybrid-application-tracking-system.git
cd hybrid-application-tracking-system
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file with the following variables:
# MONGO_URI=mongodb://localhost:27017/hybrid-ats
# JWT_SECRET=your_super_secure_secret_key
# JWT_EXPIRES_IN=7d
# PORT=3000
# NODE_ENV=development
# CORS_ORIGIN=http://localhost:5173

# Start the backend server
npm run dev
```

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install

# Create .env file with:
# VITE_API_BASE=http://localhost:3000/api

# Start the frontend development server
npm run dev
```

4. **Load Demo Data** (Optional but recommended)
```bash
cd backend
npm run load-data
```

This creates:
- 7 Demo Users (1 Admin, 1 Bot Mimic, 5 Applicants)
- 8 Demo Jobs (4 Technical, 4 Non-Technical)
- 5 Applicant Profiles
- 10 Demo Applications with various statuses

### Access the Application

**Frontend URL**: http://localhost:5173

**Demo Login Credentials**:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | admin123 |
| Bot Mimic | bot@demo.com | bot123 |
| Applicant | applicant@demo.com | applicant123 |

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/me` - Get current user (protected)

### Jobs
- `POST /api/jobs/create` - Create job posting (Admin only)
- `GET /api/jobs/all` - Get all jobs (public)
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job (Admin only)
- `DELETE /api/jobs/:id` - Delete job (Admin only)

### Applications
- `POST /api/applications/submit` - Submit application (Applicant only)
- `GET /api/applications/my` - Get user's applications
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id/status` - Update application status
- `GET /api/applications/all` - Get all applications (Admin only)
- `POST /api/applications/:id/comments` - Add comment to application

### Bot Mimic
- `POST /api/bot-mimic/process` - Process technical applications (Bot Mimic only)
- `GET /api/bot-mimic/stats` - Get processing statistics

### Audit Logs
- `GET /api/audit-logs` - Get audit logs with filters (Admin only)
- `GET /api/audit-logs/stats` - Get audit statistics (Admin only)

### Dashboard
- `GET /api/dashboard/applicant` - Applicant dashboard data
- `GET /api/dashboard/admin` - Admin dashboard data
- `GET /api/dashboard/bot-mimic` - Bot Mimic dashboard data
- `GET /api/dashboard/analytics` - Analytics data (Admin only)

### User Management
- `GET /api/users/all` - Get all users (Admin only)
- `GET /api/users/:id` - Get user details (Admin only)

### Profile
- `GET /api/profile/my` - Get own profile
- `POST /api/profile/create` - Create profile
- `PUT /api/profile/update` - Update profile
- `GET /api/profile/:userId` - Get user profile (Admin only)

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication with expiration
- **Password Hashing** - bcryptjs with salt rounds for secure password storage
- **Role-Based Access Control** - Middleware enforces role-specific permissions
- **Protected Routes** - Both backend and frontend route protection
- **File Upload Validation** - File type and size restrictions
- **Input Validation** - Server-side validation for all endpoints
- **CORS Configuration** - Controlled cross-origin access
- **Audit Logging** - Complete activity tracking for accountability
- **Session Management** - JWT token-based sessions

## � Responsive Design

- Fully responsive UI built with Tailwind CSS
- Mobile-first design approach
- Optimized for desktop, tablet, and mobile devices
- Interactive charts and visualizations
- Smooth animations and transitions

## 🎯 Key Workflows

### Applicant Workflow
1. Register/Login as Applicant
2. Create/Update Profile
3. Browse available jobs
4. Apply to jobs with resume upload
5. Track application status
6. View application history and comments

### Admin Workflow
1. Login as Admin
2. Create job postings
3. Review incoming applications
4. Update application statuses (for non-technical roles)
5. Add comments and feedback
6. View analytics and reports
7. Monitor audit logs
8. Manage users

### Bot Mimic Workflow
1. Login as Bot Mimic
2. View technical applications queue
3. Trigger automated processing
4. Monitor processing statistics
5. Review automated updates

## 📈 Analytics & Insights

- Real-time application metrics
- Status distribution visualization
- Job type analysis (Technical vs Non-Technical)
- Application funnel tracking
- Success rate calculations
- Processing time analytics
- User activity monitoring

## 🔍 Audit & Compliance

- Complete audit trail for all actions
- User attribution and timestamps
- Before/after state tracking
- Filterable audit logs
- Compliance-ready reporting
- Transparent automated vs manual updates

## 💡 Use Cases

1. **Job Recruitment** - Manage complete hiring pipeline
2. **Application Tracking** - Track all application stages
3. **Automation Simulation** - Simulate API-based automated systems
4. **Manual Processing** - Handle non-automated workflows
5. **Compliance Tracking** - Maintain complete audit trails
6. **Analytics** - Gain insights into recruitment process
7. **Multi-Role System** - Support different user types

## 🚀 Development Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run load-data  # Load demo data
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 📝 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/hybrid-ats
JWT_SECRET=your_super_secure_secret_key
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE=http://localhost:3000/api
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Joe Anidas**
- GitHub: [@joe-anidas](https://github.com/joe-anidas)

## 🙏 Acknowledgments

- Built as a comprehensive solution for hybrid application tracking systems
- Demonstrates integration of automated and manual workflows
- Provides complete transparency and traceability in recruitment processes

---

**Note**: This system provides complete traceability and transparency for both automated and manual application workflows, ensuring fair and accountable hiring processes across technical and non-technical roles.

