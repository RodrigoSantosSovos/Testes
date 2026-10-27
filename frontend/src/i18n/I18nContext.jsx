import { useState, useCallback, useMemo } from 'react'
import translations from './translations'
import { I18nContext } from './context'

const SUPPORTED = ['pt', 'en', 'es']

function detectLang() {
  const stored = localStorage.getItem('app-lang')
  if (stored && SUPPORTED.includes(stored)) return stored
  const nav = navigator.language?.slice(0, 2)
  if (SUPPORTED.includes(nav)) return nav
  return 'pt'
}

export function I18nProvider({ children }) {
  const [locale, setLocaleRaw] = useState(detectLang)

  const setLocale = useCallback((l) => {
    setLocaleRaw(l)
    localStorage.setItem('app-lang', l)
    document.documentElement.lang = l
  }, [])

  const t = useMemo(() => translations[locale] || translations.pt, [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}
