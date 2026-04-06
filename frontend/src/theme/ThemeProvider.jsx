import { useState, useCallback, useMemo, useEffect } from 'react'
import { ThemeContext } from './themeContext'

function detectTheme() {
  const stored = localStorage.getItem('app-theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export function ThemeProvider({ children }) {
  const [theme, setThemeRaw] = useState(() => {
    const t = detectTheme()
    applyTheme(t)
    return t
  })

  const setTheme = useCallback((t) => {
    setThemeRaw(t)
    localStorage.setItem('app-theme', t)
    applyTheme(t)
  }, [])

  const toggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (!localStorage.getItem('app-theme')) {
        const next = mq.matches ? 'dark' : 'light'
        setThemeRaw(next)
        applyTheme(next)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
