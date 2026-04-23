import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '../../i18n/useI18n'
import {
  getDocumentTypesByCompany, getCompanyCodesByCompanyAndDocType,
  getConstants, saveConstants, saveConstant,
} from '../../services/configurationService'
import CompanyAutocomplete from './components/CompanyAutocomplete'
import ConstantAccordion from './components/ConstantAccordion'
import './GeneralConfigPage.css'

function GeneralConfigPage() {
  const { t } = useI18n()
  const c = t.config

  const [companyId, setCompanyId] = useState('')
  const [companyLabel, setCompanyLabel] = useState('')
  const [docTypes, setDocTypes] = useState([])
  const [documentType, setDocumentType] = useState('')
  const [codes, setCodes] = useState([])
  const [companyCode, setCompanyCode] = useState('')
  const [constants, setConstants] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [filtersCollapsed, setFiltersCollapsed] = useState(false)

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }, [])

  useEffect(() => {
    if (companyId) {
      getDocumentTypesByCompany(companyId).then((types) => {
        setDocTypes(types)
        if (types.length === 1) setDocumentType(types[0].value)
      })
    }
  }, [companyId])

  useEffect(() => {
    if (companyId && documentType) {
      getCompanyCodesByCompanyAndDocType(companyId, documentType).then((result) => {
        setCodes(result)
        if (result.length === 1) setCompanyCode(result[0].value)
      })
    }
  }, [companyId, documentType])

  const handleFilter = useCallback((e) => {
    e.preventDefault()
    if (!companyId || !documentType || !companyCode) return
    setLoading(true)
    getConstants(companyId, documentType, companyCode)
      .then((data) => {
        setConstants(data)
        setFiltersCollapsed(true)
      })
      .finally(() => setLoading(false))
  }, [companyId, documentType, companyCode])

  const handleConstantChange = useCallback((name, value) => {
    setConstants((prev) => prev.map((c) =>
      c.constantName === name ? { ...c, constantValue: value } : c
    ))
  }, [])

  const handleSaveAll = useCallback(() => {
    if (!constants) return
    setSaving(true)
    saveConstants(companyId, documentType, companyCode, constants)
      .then((res) => showAlert('success', res.message))
      .catch(() => showAlert('danger', c.saveError))
      .finally(() => setSaving(false))
  }, [constants, companyId, documentType, companyCode, showAlert, c])

  const handleSaveIndividual = useCallback((constant) => {
    saveConstant(constant)
      .then(() => showAlert('success', `${constant.constantName} ${c.savedOk}`))
      .catch(() => showAlert('danger', c.saveError))
  }, [showAlert, c])

  const categories = constants
    ? constants.reduce((acc, ct) => {
        const cat = ct.category || 'Other'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(ct)
        return acc
      }, {})
    : null

  const canFilter = companyId && documentType && companyCode

  return (
    <div className="cfg-general-page">
      {alert && (
        <div className={`doc-alert ${alert.type}`}>
          <span>{alert.message}</span>
          <button className="alert-close" onClick={() => setAlert(null)}>×</button>
        </div>
      )}

      <form className="cfg-filters-panel" onSubmit={handleFilter}>
        <div className="cfg-filters-header">
          <h2>{c.filters}</h2>
          <div className="cfg-filters-header-actions">
            {filtersCollapsed && (
              <button type="button" className="ghost-btn" onClick={() => setFiltersCollapsed(false)}>
                {c.showFilters}
              </button>
            )}
          </div>
        </div>

        {!filtersCollapsed && (
          <div className="cfg-filter-fields">
            <CompanyAutocomplete
              value={companyId}
              onChange={(id, label) => {
                setCompanyId(id); setCompanyLabel(label)
                setDocumentType(''); setCodes([]); setCompanyCode(''); setConstants(null); setDocTypes([])
              }}
              label={c.company}
              placeholder={c.companyPlaceholder}
              noResults={c.noResults}
            />

            <label className="doc-field">
              <span className="doc-field-label">{c.documentType} *</span>
              <select
                value={documentType}
                onChange={(e) => { setDocumentType(e.target.value); setCodes([]); setCompanyCode(''); setConstants(null) }}
                disabled={!docTypes.length}
              >
                {docTypes.length !== 1 && <option value="">{c.selectDocType}</option>}
                {docTypes.map((dt) => (
                  <option key={dt.value} value={dt.value}>{dt.key}</option>
                ))}
              </select>
            </label>

            <label className="doc-field">
              <span className="doc-field-label">{c.companyCode} *</span>
              <select
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
                disabled={!codes.length}
              >
                {codes.length !== 1 && <option value="">{c.selectCode}</option>}
                {codes.map((cd) => (
                  <option key={cd.value} value={cd.value}>{cd.key}</option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="primary-btn cfg-filter-btn"
              disabled={!canFilter || loading}
            >
              {loading ? <span className="doc-spinner" /> : c.filter}
            </button>
          </div>
        )}

        {filtersCollapsed && (
          <div className="cfg-filter-summary">
            <span><strong>{c.company}:</strong> {companyLabel || companyId}</span>
            <span><strong>{c.documentType}:</strong> {documentType}</span>
            <span><strong>{c.companyCode}:</strong> {companyCode}</span>
          </div>
        )}
      </form>

      {categories && (
        <div className="cfg-constants-section">
          <div className="cfg-constants-header">
            <button
              type="button"
              className="primary-btn"
              onClick={handleSaveAll}
              disabled={saving}
            >
              {saving ? <span className="doc-spinner" /> : c.saveAll}
            </button>
          </div>

          <ConstantAccordion
            categories={categories}
            onConstantChange={handleConstantChange}
            onSaveIndividual={handleSaveIndividual}
            t={t}
          />

          <div className="cfg-constants-footer">
            <button
              type="button"
              className="primary-btn"
              onClick={handleSaveAll}
              disabled={saving}
            >
              {saving ? <span className="doc-spinner" /> : c.saveAll}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GeneralConfigPage
