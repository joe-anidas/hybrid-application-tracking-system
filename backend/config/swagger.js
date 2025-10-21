import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hybrid Application Tracking System API',
      version: '1.0.0',
      description: `
A comprehensive full-stack application tracking system that handles both automated (technical roles) 
and manual (non-technical roles) application workflows with complete audit trails and role-based access control.

## Features
- **Role-Based Authentication**: JWT-based authentication with three user roles (Applicant, Bot Mimic, Admin)
- **Job Management**: Create, update, and manage job postings with technical/non-technical classification
- **Application Tracking**: Submit and track applications with complete status history
- **Bot Mimic Automation**: Automated processing for technical role applications
- **Admin Management**: Manual processing for non-technical applications
- **Complete Audit Trail**: Full traceability of all actions with timestamps and user attribution
- **Analytics Dashboard**: Real-time metrics and visualizations

## Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | Admin@Demo2025!Secure |
| Bot Mimic | bot@demo.com | BotMimic@Demo2025!Auto |
| Applicant | applicant@demo.com | Applicant@Demo2025!Job |
      `,
      contact: {
        name: 'Joe Anidas',
        url: 'https://github.com/joe-anidas',
        email: 'contact@example.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://hybrid-application-tracking-system-lydq.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: { type: 'string', enum: ['Applicant', 'Bot Mimic', 'Admin'], example: 'Applicant' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Job: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string', example: 'Senior Full Stack Developer' },
            department: { type: 'string', example: 'Engineering' },
            location: { type: 'string', example: 'Remote' },
            type: { type: 'string', enum: ['full-time', 'part-time', 'contract', 'internship'] },
            jobType: { type: 'string', enum: ['technical', 'non-technical'], example: 'technical' },
            level: { type: 'string', enum: ['entry', 'mid', 'senior', 'lead', 'executive'] },
            description: { type: 'string' },
            requirements: { type: 'string' },
            responsibilities: { type: 'string' },
            salaryMin: { type: 'number', example: 80000 },
            salaryMax: { type: 'number', example: 120000 },
            applicationDeadline: { type: 'string', format: 'date' },
            skills: { type: 'array', items: { type: 'string' } },
            benefits: { type: 'string' },
            status: { type: 'string', enum: ['active', 'closed'], default: 'active' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Application: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            job: { type: 'string', description: 'Job ID' },
            applicant: { type: 'string', description: 'User ID' },
            profile: { type: 'string', description: 'ApplicantProfile ID' },
            coverLetter: { type: 'string' },
            whyInterested: { type: 'string' },
            relevantExperience: { type: 'string' },
            availableStartDate: { type: 'string', format: 'date' },
            salaryExpectation: { type: 'number' },
            resumeUrl: { type: 'string' },
            status: {
              type: 'string',
              enum: ['submitted', 'under-review', 'shortlisted', 'rejected', 'withdrawn', 'accepted']
            },
            statusHistory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  changedBy: { type: 'string' },
                  changedByName: { type: 'string' },
                  changedByRole: { type: 'string' },
                  comment: { type: 'string' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        ApplicantProfile: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string', description: 'User ID' },
            fullName: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string', example: '+1234567890' },
            location: { type: 'string', example: 'New York, NY' },
            summary: { type: 'string' },
            education: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  degree: { type: 'string' },
                  institution: { type: 'string' },
                  year: { type: 'string' },
                  field: { type: 'string' }
                }
              }
            },
            experience: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  company: { type: 'string' },
                  startDate: { type: 'string' },
                  endDate: { type: 'string' },
                  current: { type: 'boolean' },
                  description: { type: 'string' }
                }
              }
            },
            skills: { type: 'array', items: { type: 'string' } },
            linkedin: { type: 'string' },
            github: { type: 'string' },
            portfolio: { type: 'string' }
          }
        },
        AuditLog: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            userName: { type: 'string' },
            userRole: { type: 'string', enum: ['Applicant', 'Bot Mimic', 'Admin', 'System'] },
            action: { type: 'string' },
            actionDescription: { type: 'string' },
            targetType: { type: 'string' },
            targetId: { type: 'string' },
            targetName: { type: 'string' },
            ipAddress: { type: 'string' },
            metadata: { type: 'object' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string', example: 'Detailed error information' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and registration endpoints'
      },
      {
        name: 'Jobs',
        description: 'Job posting management endpoints'
      },
      {
        name: 'Applications',
        description: 'Application submission and tracking endpoints'
      },
      {
        name: 'Profile',
        description: 'Applicant profile management endpoints'
      },
      {
        name: 'Bot Mimic',
        description: 'Automated application processing endpoints'
      },
      {
        name: 'Dashboard',
        description: 'Dashboard data and analytics endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints (Admin only)'
      },
      {
        name: 'Audit Logs',
        description: 'Audit trail and logging endpoints (Admin only)'
      }
    ]
  },
  apis: ['./routes/*.js', './docs/*.swagger.js', './server.js']
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
