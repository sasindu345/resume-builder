# Resume Builder - Backend API

Spring Boot REST API for the Resume Builder application with MongoDB, JWT authentication, and email verification.

## 🛠️ Tech Stack

- **Framework:** Spring Boot 3.4.1
- **Language:** Java 21
- **Database:** MongoDB 5.0+
- **Security:** Spring Security 6.4.2 + JWT
- **Email:** JavaMail (Gmail SMTP)
- **Build:** Maven 3.9+

## 🚀 Quick Start

### 1. Configure Environment

Create `.env` file:

\`\`\`properties
MONGODB_URI=mongodb://localhost:27017/resumebuilder_dev
JWT_SECRET=your-secret-key-minimum-256-bits
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=http://localhost:5174
\`\`\`

### 2. Run Application

\`\`\`bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
\`\`\`

Backend runs on \`http://localhost:8080\`

## 📡 API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user  
- \`GET /api/auth/verify-email?token=\` - Verify email
- \`POST /api/auth/forgot-password\` - Request password reset
- \`POST /api/auth/reset-password\` - Reset password

### User (Protected)
- \`GET /api/user/profile\` - Get profile
- \`PUT /api/user/profile\` - Update profile
- \`POST /api/user/change-password\` - Change password

### Resume (Protected)
- \`GET /api/resume\` - Get all resumes
- \`POST /api/resume\` - Create resume
- \`GET /api/resume/{id}\` - Get resume
- \`PUT /api/resume/{id}\` - Update resume
- \`DELETE /api/resume/{id}\` - Delete resume

## 🔐 Security Features

✅ JWT authentication
✅ Email verification (24h expiry)
✅ Password reset (1h expiry)
✅ BCrypt password hashing
✅ CORS configuration
✅ Request validation

## 📧 Email Service

Sends automated emails using Gmail SMTP:
- Verification emails on registration
- Welcome emails after verification
- Password reset emails

## 📝 Documentation

See [PROJECT_ROADMAP.md](PROJECT_ROADMAP.md) for detailed backend development progress.
