# Resume Builder - Frontend

Modern React + TypeScript frontend with Tailwind CSS v4, real-time preview, and responsive design.

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 4.5
- **Styling:** Tailwind CSS v4.1
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 🚀 Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment

Create \`.env\` file:

\`\`\`env
VITE_API_URL=http://localhost:8080/api
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

App runs on \`http://localhost:5174\`

### 4. Build for Production

\`\`\`bash
npm run build
\`\`\`

## 📁 Key Directories

\`\`\`
src/
├── components/      # React components
├── pages/          # Page components
├── contexts/       # Context providers
├── services/       # API services
├── hooks/          # Custom hooks
├── styles/         # Global styles
└── types/          # TypeScript types
\`\`\`

## 🎨 Features

✅ Email verification flow
✅ JWT authentication
✅ Dark mode support
✅ Responsive design
✅ Form validation
✅ Protected routes
✅ Toast notifications

## 🔐 Authentication

Uses JWT tokens stored in localStorage. AuthContext provides:
- \`user\` - Current user data
- \`login()\` - Login function
- \`logout()\` - Logout function
- \`register()\` - Registration function

## 📝 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint

## 🎯 Pages

- \`/\` - Home page
- \`/login\` - Login page
- \`/register\` - Registration page
- \`/verify-email\` - Email verification
- \`/dashboard\` - User dashboard (protected)
- \`/resume/:id\` - Resume editor (protected)
