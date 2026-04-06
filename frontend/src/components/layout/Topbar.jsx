import { useState, useRef, useEffect } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { useTheme } from '../../theme/useTheme'

const FLAGS = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸' }
const LOCALES = ['pt', 'en', 'es']

function Topbar({ title, subtitle, searchPlaceholder, actionLabel, onMenuClick }) {
  const { locale, setLocale, t } = useI18n()
  const { theme, toggle: toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="menu-hamburger"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M3 6h16M3 11h16M3 16h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="topbar-actions">
        <input type="text" placeholder={searchPlaceholder} />
        <button className="primary-btn">{actionLabel}</button>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <div className="lang-switcher" ref={ref}>
          <button
            className="lang-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label="Change language"
          >
            <span className="lang-flag">{FLAGS[locale]}</span>
            <span className="lang-code">{locale.toUpperCase()}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {open && (
            <ul className="lang-dropdown">
              {LOCALES.map((l) => (
                <li key={l}>
                  <button
                    className={`lang-option ${l === locale ? 'active' : ''}`}
                    onClick={() => { setLocale(l); setOpen(false) }}
                  >
                    <span className="lang-flag">{FLAGS[l]}</span>
                    <span>{t.lang[l]}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
