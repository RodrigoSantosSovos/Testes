import { useState, useEffect, useCallback, useRef } from 'react'
import { useI18n } from '../../i18n/useI18n'
import {
  getDocumentTypesByCompany, getCompanyCodesByCompanyAndDocType,
} from '../../services/configurationService'
import {
  getRules, getRule, createRule, updateRule, deleteRule,
  getPaperSources, getProcessesForDocType, validateFile,
} from '../../services/rulePrintService'
import CompanyAutocomplete from './components/CompanyAutocomplete'
import './RulePrintPage.css'

const EMPTY_RULE = {
  ruleName: '', printerName: '', process: '', paperSource: '7', copies: 1,
  reportLayout: '', pclTemplate: '', storePdf: false, printerAgent: '',
  xpathCondition: '', fileName: '',
}

function RulePrintPage() {
  const { t } = useI18n()
  const rp = t.rulePrint

  const [companyId, setCompanyId] = useState('')
  const [companyLabel, setCompanyLabel] = useState('')
  const [docTypes, setDocTypes] = useState([])
  const [documentType, setDocumentType] = useState('')
  const [codes, setCodes] = useState([])
  const [companyCode, setCompanyCode] = useState('')

  const [rules, setRules] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filtersCollapsed, setFiltersCollapsed] = useState(false)
  const [alert, setAlert] = useState(null)

  const [view, setView] = useState('list')
  const [form, setForm] = useState(EMPTY_RULE)
  const [isEdit, setIsEdit] = useState(false)
  const [formErrors, setFormErrors] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)

  const layoutFileRef = useRef(null)
  const pclFileRef = useRef(null)

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
    getRules(companyId, documentType, companyCode)
      .then((data) => { setRules(data); setFiltersCollapsed(true) })
      .finally(() => setLoading(false))
  }, [companyId, documentType, companyCode])

  const refreshList = useCallback(() => {
    getRules(companyId, documentType, companyCode).then(setRules)
  }, [companyId, documentType, companyCode])

  const handleNewRule = useCallback(() => {
    setForm({ ...EMPTY_RULE, companyId, documentType, companyCode })
    setIsEdit(false)
    setFormErrors('')
    setView('form')
  }, [companyId, documentType, companyCode])

  const handleEditRule = useCallback((ruleName) => {
    getRule(companyId, documentType, companyCode, ruleName).then((rule) => {
      if (rule) { setForm(rule); setIsEdit(true); setFormErrors(''); setView('form') }
    })
  }, [companyId, documentType, companyCode])

  const handleDeleteRule = useCallback(() => {
    if (!deleteModal) return
    deleteRule(companyId, documentType, companyCode, deleteModal)
      .then(() => { showAlert('success', rp.ruleDeleted); refreshList() })
    setDeleteModal(null)
  }, [deleteModal, companyId, documentType, companyCode, showAlert, rp, refreshList])

  const handleFormChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSave = useCallback((e) => {
    e.preventDefault()
    setFormErrors('')

    if (!form.ruleName || !form.printerName || !form.process) {
      setFormErrors(rp.requiredFields)
      return
    }

    if (!isEdit) {
      const layoutFile = layoutFileRef.current?.files[0]
      const err = validateFile(layoutFile, 'ReportLayout')
      if (err) { setFormErrors(err); return }
    }

    const layoutFile = layoutFileRef.current?.files[0] || null
    const pclFile = pclFileRef.current?.files[0] || null

    if (layoutFile) handleFormChange('reportLayout', layoutFile.name)
    if (pclFile) handleFormChange('pclTemplate', pclFile.name)

    const ruleData = {
      ...form,
      reportLayout: layoutFile ? layoutFile.name : form.reportLayout,
      pclTemplate: pclFile ? pclFile.name : form.pclTemplate,
    }

    setSaving(true)
    const action = isEdit ? updateRule(ruleData, layoutFile, pclFile) : createRule(ruleData, layoutFile, pclFile)
    action
      .then(() => {
        showAlert('success', isEdit ? rp.ruleUpdated : rp.ruleCreated)
        refreshList()
        setView('list')
      })
      .catch((err) => {
        setFormErrors(err.message === 'RULE_EXISTS' ? rp.ruleExists : rp.saveError)
      })
      .finally(() => setSaving(false))
  }, [form, isEdit, showAlert, rp, refreshList, handleFormChange])

  const processes = documentType ? getProcessesForDocType(documentType) : []
  const paperSources = getPaperSources()

  if (view === 'form') {
    return (
      <div className="rp-page">
        {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.message}</span><button className="alert-close" onClick={() => setAlert(null)}>×</button></div>}

        <div className="rp-form-toolbar">
          <button className="ghost-btn" onClick={() => setView('list')}>← {rp.back}</button>
          <h2>{isEdit ? rp.editRule : rp.addRule}</h2>
        </div>

        {formErrors && <div className="doc-alert danger"><span>{formErrors}</span><button className="alert-close" onClick={() => setFormErrors('')}>×</button></div>}

        <form className="rp-form-panel" onSubmit={handleSave}>
          <div className="rp-form-grid">
            <ReadonlyField label={rp.company} value={companyLabel || companyId} />
            <ReadonlyField label={rp.documentType} value={documentType} />
            <ReadonlyField label={rp.companyCode} value={companyCode} />

            <label className="rp-field">
              <span className="doc-field-label">{rp.ruleName} *</span>
              <input type="text" value={form.ruleName} onChange={(e) => handleFormChange('ruleName', e.target.value)} disabled={isEdit} />
            </label>

            <label className="rp-field">
              <span className="doc-field-label">{rp.printerName} *</span>
              <input type="text" value={form.printerName} onChange={(e) => handleFormChange('printerName', e.target.value)} />
            </label>

            <label className="rp-field">
              <span className="doc-field-label">{rp.process} *</span>
              <select value={form.process} onChange={(e) => handleFormChange('process', e.target.value)}>
                <option value="">{t.config.selectDocType}</option>
                {processes.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>

            <label className="rp-field">
              <span className="doc-field-label">{rp.paperSource}</span>
              <select value={form.paperSource} onChange={(e) => handleFormChange('paperSource', e.target.value)}>
                {paperSources.map((ps) => <option key={ps.value} value={ps.value}>{ps.label}</option>)}
              </select>
            </label>

            <label className="rp-field">
              <span className="doc-field-label">{rp.copies}</span>
              <input type="number" min="1" value={form.copies} onChange={(e) => handleFormChange('copies', Number(e.target.value))} />
            </label>

            <label className="rp-field-check">
              <input type="checkbox" checked={form.storePdf} onChange={(e) => handleFormChange('storePdf', e.target.checked)} />
              <span>{rp.storePdf}</span>
            </label>

            <div className="rp-field rp-field-upload">
              <span className="doc-field-label">{rp.reportLayout} {!isEdit && '*'}</span>
              <div className="rp-upload-row">
                <input
                  type="text"
                  value={form.reportLayout}
                  readOnly
                  onClick={() => layoutFileRef.current?.click()}
                  placeholder={rp.selectFile}
                />
                <input type="file" ref={layoutFileRef} className="rp-file-hidden" accept=".xml,.txt,.zip,.rar,.rpt,.ppk,.key,.crt,.cer,.pfx,.p12,.sp,.xls,.xlsx,.xlst,.xsd" onChange={(e) => { if (e.target.files[0]) handleFormChange('reportLayout', e.target.files[0].name) }} />
                <button type="button" className="ghost-btn rp-browse-btn" onClick={() => layoutFileRef.current?.click()}>📁</button>
                {isEdit && form.reportLayout && (
                  <a href={`#download/${form.reportLayout}`} className="ghost-btn rp-download-btn" title={rp.downloadLayout}>⬇️</a>
                )}
              </div>
            </div>

            <div className="rp-field rp-field-upload">
              <span className="doc-field-label">{rp.pclTemplate}</span>
              <div className="rp-upload-row">
                <input
                  type="text"
                  value={form.pclTemplate}
                  readOnly
                  onClick={() => pclFileRef.current?.click()}
                  placeholder={rp.selectFile}
                />
                <input type="file" ref={pclFileRef} className="rp-file-hidden" accept=".xml,.txt,.zip,.rar,.rpt,.ppk,.key,.crt,.cer,.pfx,.p12,.sp,.xls,.xlsx,.xlst,.xsd" onChange={(e) => { if (e.target.files[0]) handleFormChange('pclTemplate', e.target.files[0].name) }} />
                <button type="button" className="ghost-btn rp-browse-btn" onClick={() => pclFileRef.current?.click()}>📁</button>
                {isEdit && form.pclTemplate && (
                  <a href={`#download/${form.pclTemplate}`} className="ghost-btn rp-download-btn" title={rp.downloadPcl}>⬇️</a>
                )}
              </div>
            </div>

            <label className="rp-field">
              <span className="doc-field-label">{rp.printerAgent}</span>
              <input type="text" value={form.printerAgent} onChange={(e) => handleFormChange('printerAgent', e.target.value)} />
            </label>

            <label className="rp-field">
              <span className="doc-field-label">{rp.fileNameOutput}</span>
              <input type="text" value={form.fileName} onChange={(e) => handleFormChange('fileName', e.target.value)} />
            </label>

            <label className="rp-field rp-field-full">
              <span className="doc-field-label">{rp.xpathCondition}</span>
              <textarea rows="4" value={form.xpathCondition} onChange={(e) => handleFormChange('xpathCondition', e.target.value)} placeholder={rp.xpathPlaceholder} />
            </label>
          </div>

          <div className="rp-form-actions">
            <button type="submit" className="primary-btn" disabled={saving}>
              {saving ? <span className="doc-spinner" /> : rp.save}
            </button>
            <button type="button" className="ghost-btn" onClick={() => setView('list')}>{rp.back}</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="rp-page">
      {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.message}</span><button className="alert-close" onClick={() => setAlert(null)}>×</button></div>}

      <form className="rp-filters-panel" onSubmit={handleFilter}>
        <div className="cfg-filters-header">
          <h2>{t.config.filters}</h2>
          {filtersCollapsed && (
            <button type="button" className="ghost-btn" onClick={() => setFiltersCollapsed(false)}>{t.config.showFilters}</button>
          )}
        </div>

        {!filtersCollapsed && (
          <div className="cfg-filter-fields">
            <CompanyAutocomplete
              value={companyId}
              onChange={(id, label) => { setCompanyId(id); setCompanyLabel(label); setDocumentType(''); setCodes([]); setCompanyCode(''); setRules(null); setDocTypes([]) }}
              label={t.config.company}
              placeholder={t.config.companyPlaceholder}
              noResults={t.config.noResults}
            />
            <label className="doc-field">
              <span className="doc-field-label">{t.config.documentType} *</span>
              <select value={documentType} onChange={(e) => { setDocumentType(e.target.value); setCodes([]); setCompanyCode(''); setRules(null) }} disabled={!docTypes.length}>
                {docTypes.length !== 1 && <option value="">{t.config.selectDocType}</option>}
                {docTypes.map((dt) => <option key={dt.value} value={dt.value}>{dt.key}</option>)}
              </select>
            </label>
            <label className="doc-field">
              <span className="doc-field-label">{t.config.companyCode} *</span>
              <select value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} disabled={!codes.length}>
                {codes.length !== 1 && <option value="">{t.config.selectCode}</option>}
                {codes.map((cd) => <option key={cd.value} value={cd.value}>{cd.key}</option>)}
              </select>
            </label>
            <button type="submit" className="primary-btn cfg-filter-btn" disabled={!companyId || !documentType || !companyCode || loading}>
              {loading ? <span className="doc-spinner" /> : t.config.filter}
            </button>
          </div>
        )}

        {filtersCollapsed && (
          <div className="cfg-filter-summary">
            <span><strong>{t.config.company}:</strong> {companyLabel || companyId}</span>
            <span><strong>{t.config.documentType}:</strong> {documentType}</span>
            <span><strong>{t.config.companyCode}:</strong> {companyCode}</span>
          </div>
        )}
      </form>

      {rules && (
        <div className="rp-list-panel">
          <div className="rp-list-header">
            <h3>{rp.rules} ({rules.length})</h3>
            <button className="primary-btn" onClick={handleNewRule}>{rp.addRule}</button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead><tr><th>{rp.ruleName}</th><th>{rp.printerName}</th><th>{rp.process}</th><th className="th-actions">{rp.actions}</th></tr></thead>
              <tbody>
                {rules.length === 0 && (
                  <tr><td colSpan="4" className="empty-row">{rp.noRules}</td></tr>
                )}
                {rules.map((r) => (
                  <tr key={r.ruleName}>
                    <td className="td-name">{r.ruleName}</td>
                    <td>{r.printerName}</td>
                    <td><span className="badge primary">{r.process}</span></td>
                    <td className="td-actions">
                      <button className="icon-btn edit" onClick={() => handleEditRule(r.ruleName)} title={rp.edit}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button className="icon-btn delete" onClick={() => setDeleteModal(r.ruleName)} title={rp.deleteRule}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="modal-backdrop" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{rp.confirmDelete}</h3>
            <p>{rp.confirmDeleteMsg} <strong>{deleteModal}</strong>?</p>
            <div className="modal-actions">
              <button className="ghost-btn" onClick={() => setDeleteModal(null)}>{rp.cancel}</button>
              <button className="danger-btn" onClick={handleDeleteRule}>{rp.deleteRule}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ReadonlyField({ label, value }) {
  return (
    <div className="rp-field">
      <span className="doc-field-label">{label}</span>
      <input type="text" value={value} disabled className="rp-readonly" />
    </div>
  )
}

export default RulePrintPage
