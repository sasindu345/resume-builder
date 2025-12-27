import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { ResumeEditor } from '@/pages/ResumeEditor'
import { Home } from '@/pages/Home'
import { VerifyEmail } from '@/pages/VerifyEmail'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { FloatingShapes } from '@/components/animations/FloatingShapes'
import headerStyles from '@/styles/components/Header.module.css'

function AppRoutes() {
  const [theme, setTheme] = useState<string>(() => {
    try {
      return localStorage.getItem('rb_theme') || 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
    }
    try {
      localStorage.setItem('rb_theme', theme)
    } catch { }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingShapes />

      <header className={headerStyles.header}>
        <div className={headerStyles.headerContent}>
          <Link to="/" className={headerStyles.logo}>ResumeBuilder · Phase 1</Link>
          <nav className={headerStyles.nav}>
            <Link to="/login" className={headerStyles.navLink}>Log in</Link>
            <Link to="/register" className={headerStyles.navLink}>Build my resume</Link>
            <button
              type="button"
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              className={headerStyles.themeToggle}
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume/:id"
          element={
            <ProtectedRoute>
              <ResumeEditor />
            </ProtectedRoute>
          }
        />
      </Routes>

    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-right" />
    </AuthProvider>
  )
}

export default App
