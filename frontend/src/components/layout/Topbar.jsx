import { useState, useRef, useEffect } from 'react'
import { useI18n } from '../../i18n/useI18n'

const FLAGS = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸' }
const LOCALES = ['pt', 'en', 'es']

function Topbar({ title, subtitle, searchPlaceholder, actionLabel, onMenuClick }) {
  const { locale, setLocale, t } = useI18n()
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
