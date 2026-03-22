import './App.css'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAuth } from '@/hooks/useAuth'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { ResumeEditor } from '@/pages/ResumeEditor'
import { Home } from '@/pages/Home'
import { GuestResumeBuilder } from '@/pages/GuestResumeBuilder'
import { VerifyEmail } from '@/pages/VerifyEmail'
import { TemplatesGallery } from '@/pages/TemplatesGallery'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { FloatingShapes } from '@/components/animations/FloatingShapes'
import headerStyles from '@/styles/components/Header.module.css'

// Sun icon
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

// Moon icon
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

// Logo icon
function LogoIcon() {
  return (
    <span className={headerStyles.logoIcon} aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="14" y2="12" />
        <line x1="7" y1="16" x2="11" y2="16" />
      </svg>
    </span>
  )
}

function AppRoutes() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

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

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingShapes />

      <header className={headerStyles.header}>
        <div className={headerStyles.headerContent}>
          {/* Logo */}
          <Link to="/" className={headerStyles.logo}>
            <LogoIcon />
            <span className={headerStyles.logoText}>ResumeBuilder</span>
          </Link>

          {/* Nav */}
          <nav className={headerStyles.nav} aria-label="Main navigation">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={headerStyles.navLink}>Dashboard</Link>
                <Link to="/templates" className={headerStyles.navLink}>Templates</Link>
                <span className={headerStyles.navDivider} aria-hidden="true" />
                <button onClick={handleLogout} className={headerStyles.navLink}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/templates" className={headerStyles.navLink}>Templates</Link>
                <Link to="/login" className={headerStyles.navLink}>Log in</Link>
                <Link to="/builder" className={headerStyles.navCTA}>
                  Build Resume
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </>
            )}
            <button
              type="button"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleTheme}
              className={headerStyles.themeToggle}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<GuestResumeBuilder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/templates" element={<TemplatesGallery />} />
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
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '0.75rem',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
          },
        }}
      />
    </AuthProvider>
  )
}

export default App
