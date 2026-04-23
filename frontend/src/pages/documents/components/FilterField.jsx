import { FIELD_TYPES } from '../../../config/documentTypes'

function FilterField({ filter, value, onChange, t }) {
  const label = filter.label || t.docFilters?.[filter.labelKey] || filter.labelKey

  if (filter.type === FIELD_TYPES.STRING) {
    return (
      <label className="doc-field">
        <span className="doc-field-label">{label}</span>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(filter.tag, e.target.value)}
          placeholder={`${label} (% wildcard)`}
        />
      </label>
    )
  }

  if (filter.type === FIELD_TYPES.INTEGER || filter.type === FIELD_TYPES.DOUBLE) {
    const from = value?.from ?? ''
    const to = value?.to ?? ''
    const inputType = filter.type === FIELD_TYPES.DOUBLE ? 'text' : 'number'
    return (
      <label className="doc-field doc-field-range">
        <span className="doc-field-label">{label}</span>
        <div className="doc-range-row">
          <input
            type={inputType}
            value={from}
            onChange={(e) => onChange(filter.tag, { ...value, from: e.target.value })}
            placeholder={t.docs.from}
          />
          <span className="doc-range-sep">{t.docs.to}</span>
          <input
            type={inputType}
            value={to}
            onChange={(e) => onChange(filter.tag, { ...value, to: e.target.value })}
            placeholder={t.docs.to}
          />
        </div>
      </label>
    )
  }

  if (filter.type === FIELD_TYPES.DATETIME) {
    const from = value?.from ?? ''
    const to = value?.to ?? ''
    return (
      <label className="doc-field doc-field-range">
        <span className="doc-field-label">{label}</span>
        <div className="doc-range-row">
          <input
            type="date"
            value={from}
            onChange={(e) => onChange(filter.tag, { ...value, from: e.target.value })}
          />
          <span className="doc-range-sep">{t.docs.to}</span>
          <input
            type="date"
            value={to}
            onChange={(e) => onChange(filter.tag, { ...value, to: e.target.value })}
          />
        </div>
      </label>
    )
  }

  if (filter.type === FIELD_TYPES.RADIO) {
    const selected = value || '0'
    const options = [
      { value: '0', label: t.docs.radioIgnore },
      { value: '1', label: t.docs.radioApproved },
      { value: '2', label: t.docs.radioRejected },
      { value: '3', label: t.docs.radioNotContains },
    ]
    return (
      <div className="doc-field doc-field-radio">
        <span className="doc-field-label">{label}</span>
        <div className="doc-radio-row">
          {options.map((opt) => (
            <label key={opt.value} className="doc-radio-option">
              <input
                type="radio"
                name={filter.tag}
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => onChange(filter.tag, opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export default FilterField
