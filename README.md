# Resume Builder Application

A modern, full-stack resume builder application with professional templates, real-time preview, and PDF export functionality.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication with email verification
- **Multiple Templates** - Professional resume templates with customizable themes
- **Real-time Preview** - See changes instantly as you type
- **PDF Export** - Download your resume as a professional PDF
- **Cloud Storage** - Save and manage multiple resumes
- **Responsive Design** - Works perfectly on all devices
- **Dark Mode** - Eye-friendly dark theme support

## 📁 Project Structure

```
resume-builder/
├── resume-builder-backend/     # Spring Boot REST API
└── resume-builder-frontend/    # React + TypeScript UI
```

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.4.1
- **Language:** Java 21
- **Database:** MongoDB
- **Security:** Spring Security + JWT
- **Email:** JavaMail with Gmail SMTP
- **Build Tool:** Maven

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6
- **Build Tool:** Vite
- **Icons:** Lucide React

## 📋 Prerequisites

- **Java 21** or higher
- **Node.js 18** or higher
- **MongoDB** (local or Atlas)
- **Maven** (bundled with mvnw)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd resume-builder
```

### 2. Setup Backend

```bash
cd resume-builder-backend

# Copy environment template
cp .env.example .env

# Configure your environment variables in .env
# - MongoDB connection string
# - JWT secret key
# - Gmail SMTP credentials

# Run the application
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Backend will start on `http://localhost:8080`

### 3. Setup Frontend

```bash
cd resume-builder-frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your environment variables in .env
# - API base URL

# Start development server
npm run dev
```

Frontend will start on `http://localhost:5174`

## 📚 Documentation

- [Backend Documentation](./resume-builder-backend/README.md)
- [Frontend Documentation](./resume-builder-frontend/README.md)
- [API Documentation](./resume-builder-backend/API.md)

## 🔐 Environment Variables

### Backend (.env)
```properties
# MongoDB
MONGODB_URI=mongodb://localhost:27017/resumebuilder_dev

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000

# Email (Gmail SMTP)
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5174
```

### Frontend (.env)
```properties
VITE_API_URL=http://localhost:8080/api
```

## 🧪 Testing

### Backend Tests
```bash
cd resume-builder-backend
./mvnw test
```

### Frontend Tests
```bash
cd resume-builder-frontend
npm test
```

## 📦 Building for Production

### Backend
```bash
cd resume-builder-backend
./mvnw clean package
java -jar target/rdsumebuilder-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### Frontend
```bash
cd resume-builder-frontend
npm run build
# Build output in dist/ folder
```

## 🔧 Development

### Backend Hot Reload
The backend uses Spring Boot DevTools for automatic restart on code changes.

### Frontend Hot Reload
Vite provides instant hot module replacement (HMR) for React components.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email?token=` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/change-password` - Change password

### Resume Management
- `GET /api/resume` - Get all user resumes
- `POST /api/resume` - Create new resume
- `GET /api/resume/{id}` - Get specific resume
- `PUT /api/resume/{id}` - Update resume
- `DELETE /api/resume/{id}` - Delete resume

## 🎨 Features in Detail

### Email Verification
- Automatic verification email sent on registration
- Secure token-based verification (24-hour expiry)
- Welcome email after successful verification

### Password Reset
- Secure token-based password reset
- Email with reset link (1-hour expiry)
- One-time use tokens

### Resume Templates
- Modern Professional
- Classic ATS-Friendly
- Creative Designer
- Tech Engineer
- All templates are customizable

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing UI library
- Tailwind CSS for the utility-first CSS framework
- All contributors and supporters

## 📞 Support

For support, email support@resumebuilder.com or open an issue in the repository.

## 🔗 Links

- [Live Demo](https://your-demo-url.com)
- [Documentation](https://docs.resumebuilder.com)
- [Report Bug](https://github.com/your-repo/issues)
- [Request Feature](https://github.com/your-repo/issues)
