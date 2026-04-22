import { useState, useRef, useEffect, useCallback } from 'react'
import { searchCompanies } from '../../../services/configurationService'

function CompanyAutocomplete({ value, onChange, label, placeholder, noResults }) {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)
  const debounce = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = useCallback((q) => {
    setQuery(q)
    if (debounce.current) clearTimeout(debounce.current)
    if (q.length < 1) { setOptions([]); setOpen(false); return }
    debounce.current = setTimeout(() => {
      setLoading(true)
      searchCompanies(q).then((results) => {
        setOptions(results)
        setOpen(true)
        setLoading(false)
      })
    }, 250)
  }, [])

  const handleSelect = useCallback((opt) => {
    onChange(opt.value, opt.text)
    setQuery(opt.text)
    setOpen(false)
  }, [onChange])

  const handleClear = useCallback(() => {
    onChange('', '')
    setQuery('')
    setOptions([])
  }, [onChange])

  return (
    <div className="cfg-autocomplete" ref={ref}>
      <span className="doc-field-label">{label} *</span>
      <div className="cfg-autocomplete-input-wrap">
        <input
          type="text"
          value={query || (value ? value : '')}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => { if (options.length) setOpen(true) }}
          placeholder={placeholder}
          autoComplete="off"
        />
        {(value || query) && (
          <button type="button" className="cfg-autocomplete-clear" onClick={handleClear}>✕</button>
        )}
      </div>
      {open && (
        <ul className="cfg-autocomplete-dropdown">
          {loading && <li className="cfg-autocomplete-status">...</li>}
          {!loading && options.length === 0 && <li className="cfg-autocomplete-status">{noResults}</li>}
          {options.map((opt) => (
            <li key={opt.value}>
              <button type="button" className={opt.value === value ? 'active' : ''} onClick={() => handleSelect(opt)}>
                {opt.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CompanyAutocomplete
