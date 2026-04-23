function FixedFilters({ values, onChange, documentTypeOptions, actionOptions, t, loading }) {
  const d = t.docs

  return (
    <div className="doc-fixed-filters">
      <label className="doc-field">
        <span className="doc-field-label">{d.documentType} *</span>
        <select value={values.documentType} onChange={(e) => onChange('documentType', e.target.value)}>
          <option value="">{d.selectDocType}</option>
          {documentTypeOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.description || `[${opt.country}] ${t.docTypes?.[opt.labelKey] || opt.labelKey}`}
            </option>
          ))}
        </select>
      </label>

      <label className="doc-field">
        <span className="doc-field-label">{d.process} *</span>
        <select value={values.process} onChange={(e) => onChange('process', e.target.value)}>
          <option value="">{d.selectProcess}</option>
          <option value="0">{d.outbound}</option>
          <option value="1">{d.inbound}</option>
        </select>
      </label>

      <label className="doc-field">
        <span className="doc-field-label">{d.action}</span>
        <select value={values.action} onChange={(e) => onChange('action', e.target.value)} disabled={!actionOptions.length}>
          <option value="">{d.selectAction}</option>
          {actionOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t.docActions?.[opt.labelKey] || opt.labelKey}
            </option>
          ))}
        </select>
      </label>

      <label className="doc-field">
        <span className="doc-field-label">{d.situation}</span>
        <select value={values.situation} onChange={(e) => onChange('situation', e.target.value)}>
          <option value="-1">{d.all}</option>
          <option value="0">{d.processing}</option>
          <option value="1">{d.finishedSuccess}</option>
          <option value="2">{d.finishedError}</option>
        </select>
      </label>

      <label className="doc-field-checkbox">
        <input type="checkbox" checked={values.historic} onChange={(e) => onChange('historic', e.target.checked)} />
        <span>{d.historic}</span>
      </label>

      <button type="submit" className="primary-btn doc-search-btn" disabled={loading || !values.documentType || !values.process}>
        {loading ? <span className="doc-spinner" /> : d.search}
      </button>
    </div>
  )
}

export default FixedFilters
