import { useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { useTheme } from '../theme/useTheme'
import { login as loginService } from '../services/authService'
import SovosLogo from '../components/common/SovosLogo'
import './LoginPage.css'

const FLAGS = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸' }
const LOCALES = ['pt', 'en', 'es']

function LoginPage({ onLogin }) {
  const { t, locale, setLocale } = useI18n()
  const { theme, toggle: toggleTheme } = useTheme()
  const l = t.login

  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!user.trim() || !password.trim()) {
      setError(l.errorEmpty)
      return
    }

    setLoading(true)
    loginService(user, password)
      .then((userData) => onLogin(userData))
      .catch(() => {
        setError(l.errorInvalid)
        setLoading(false)
      })
  }

  return (
    <div className="login-page">
      <div className="login-toolbar">
        <button
          className="login-theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </button>
        <div className="login-lang-group">
          {LOCALES.map((code) => (
            <button
              key={code}
              className={`login-lang-btn ${locale === code ? 'active' : ''}`}
              onClick={() => setLocale(code)}
            >
              <span className="login-lang-flag">{FLAGS[code]}</span>
              <span>{code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <SovosLogo width={140} className="login-logo" />
          <h1>{l.title}</h1>
          <p>{l.subtitle}</p>
        </div>

        {error && (
          <div className="login-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            <span>{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>{l.user}</span>
            <div className="login-input-wrap">
              <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder={l.userPlaceholder}
                autoComplete="username"
                autoFocus
              />
            </div>
          </label>

          <label className="login-field">
            <span>{l.password}</span>
            <div className="login-input-wrap">
              <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={l.passwordPlaceholder}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                )}
              </button>
            </div>
          </label>

          <div className="login-options">
            <label className="login-remember">
              <input type="checkbox" />
              <span>{l.rememberMe}</span>
            </label>
            <a href="#" className="login-forgot" onClick={(e) => e.preventDefault()}>
              {l.forgotPassword}
            </a>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <span className="login-spinner" />
            ) : (
              l.submit
            )}
          </button>
        </form>

        <p className="login-hint">
          Demo: <strong>admin</strong> / <strong>admin</strong>
        </p>
      </div>

      <footer className="login-footer">
        © {new Date().getFullYear()} Sovos. {t.footer.rights}
      </footer>
    </div>
  )
}

export default LoginPage
