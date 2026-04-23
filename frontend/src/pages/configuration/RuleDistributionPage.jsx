import { useState, useEffect, useCallback, useRef } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { getDocumentTypesByCompany, getCompanyCodesByCompanyAndDocType } from '../../services/configurationService'
import { getProcessesForDocType } from '../../services/rulePrintService'
import {
  getDistributionRules, getDistributionRule, createDistributionRule,
  updateDistributionRule, deleteDistributionRule, getEmptyRule, getFtpProtocols,
} from '../../services/ruleDistributionService'
import CompanyAutocomplete from './components/CompanyAutocomplete'
import './RuleDistributionPage.css'

function RuleDistributionPage() {
  const { t } = useI18n()
  const rd = t.ruleDist

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
  const [form, setForm] = useState(getEmptyRule())
  const [isEdit, setIsEdit] = useState(false)
  const [editTab, setEditTab] = useState('general')
  const [formErrors, setFormErrors] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)

  /* file refs managed by FileUploadField */

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message }); setTimeout(() => setAlert(null), 4000)
  }, [])

  useEffect(() => {
    if (companyId) getDocumentTypesByCompany(companyId).then((types) => { setDocTypes(types); if (types.length === 1) setDocumentType(types[0].value) })
  }, [companyId])

  useEffect(() => {
    if (companyId && documentType) getCompanyCodesByCompanyAndDocType(companyId, documentType).then((r) => { setCodes(r); if (r.length === 1) setCompanyCode(r[0].value) })
  }, [companyId, documentType])

  const handleFilter = useCallback((e) => {
    e.preventDefault()
    if (!companyId || !documentType || !companyCode) return
    setLoading(true)
    getDistributionRules(companyId, documentType, companyCode).then((d) => { setRules(d); setFiltersCollapsed(true) }).finally(() => setLoading(false))
  }, [companyId, documentType, companyCode])

  const refreshList = useCallback(() => { getDistributionRules(companyId, documentType, companyCode).then(setRules) }, [companyId, documentType, companyCode])

  const handleNew = useCallback(() => {
    setForm({ ...getEmptyRule(), companyId, documentType, companyCode })
    setIsEdit(false); setFormErrors(''); setView('form')
  }, [companyId, documentType, companyCode])

  const handleEdit = useCallback((ruleName) => {
    getDistributionRule(companyId, documentType, companyCode, ruleName).then((r) => {
      if (r) { setForm(r); setIsEdit(true); setEditTab('general'); setFormErrors(''); setView('form') }
    })
  }, [companyId, documentType, companyCode])

  const handleDelete = useCallback(() => {
    if (!deleteModal) return
    deleteDistributionRule(companyId, documentType, companyCode, deleteModal).then(() => { showAlert('success', rd.ruleDeleted); refreshList() })
    setDeleteModal(null)
  }, [deleteModal, companyId, documentType, companyCode, showAlert, rd, refreshList])

  const handleFormChange = useCallback((field, value) => { setForm((p) => ({ ...p, [field]: value })) }, [])

  const handleSaveNew = useCallback((e) => {
    e.preventDefault()
    if (!form.ruleName || !form.process) { setFormErrors(rd.requiredFields); return }
    setSaving(true)
    createDistributionRule(form)
      .then(() => { showAlert('success', rd.ruleCreated); setIsEdit(true); setEditTab('general') })
      .catch((err) => setFormErrors(err.message === 'RULE_EXISTS' ? rd.ruleExists : rd.saveError))
      .finally(() => setSaving(false))
  }, [form, showAlert, rd])

  const handleSaveTab = useCallback((e) => {
    e.preventDefault()
    setSaving(true)
    updateDistributionRule(form, editTab)
      .then(() => showAlert('success', rd.tabSaved))
      .catch(() => setFormErrors(rd.saveError))
      .finally(() => setSaving(false))
  }, [form, editTab, showAlert, rd])

  /* file open/change handled by FileUploadField */

  const processes = documentType ? getProcessesForDocType(documentType) : []
  const ftpProtocols = getFtpProtocols()
  const TABS = [
    { id: 'general', label: rd.tabGeneral },
    { id: 'email', label: 'Email' },
    { id: 'webservice', label: 'WebService' },
    { id: 'ftp', label: 'FTP' },
    { id: 'as2', label: 'AS2' },
  ]

  // ---- FORM VIEW (New + Edit) ----
  if (view === 'form') {
    return (
      <div className="rd-page">
        {alert && <Alert alert={alert} onClose={() => setAlert(null)} />}
        <div className="rp-form-toolbar">
          <button className="ghost-btn" onClick={() => { setView('list'); refreshList() }}>← {rd.back}</button>
          <h2>{isEdit ? rd.editRule : rd.addRule}</h2>
        </div>
        {formErrors && <div className="doc-alert danger"><span>{formErrors}</span><button className="alert-close" onClick={() => setFormErrors('')}>×</button></div>}

        {!isEdit ? (
          <form className="rp-form-panel" onSubmit={handleSaveNew}>
            <div className="rp-form-grid">
              <RO label={rd.company} value={companyLabel || companyId} />
              <RO label={rd.documentType} value={documentType} />
              <RO label={rd.companyCode} value={companyCode} />
              <Field label={rd.ruleName + ' *'} value={form.ruleName} onChange={(v) => handleFormChange('ruleName', v)} />
              <SelectField label={rd.process + ' *'} value={form.process} onChange={(v) => handleFormChange('process', v)} options={processes.map((p) => ({ value: p, label: p }))} placeholder={t.config.selectDocType} />
              <Field label={rd.attachments + ' *'} value={form.attachments} onChange={(v) => handleFormChange('attachments', v)} />
              <Field label={rd.fileNameToAttach + ' *'} value={form.fileNameToAttach} onChange={(v) => handleFormChange('fileNameToAttach', v)} />
              <Field label={rd.extensionsToAttach + ' *'} value={form.extensionsToAttach} onChange={(v) => handleFormChange('extensionsToAttach', v)} />
              <div className="rp-field rp-field-full">
                <span className="doc-field-label">{rd.xpathCondition}</span>
                <textarea rows="3" value={form.xpathCondition} onChange={(e) => handleFormChange('xpathCondition', e.target.value)} placeholder="Ex: //ide/tpEmis[text()='5']" />
              </div>
            </div>
            <div className="rp-form-actions">
              <button type="submit" className="primary-btn" disabled={saving}>{saving ? <span className="doc-spinner" /> : rd.save}</button>
              <button type="button" className="ghost-btn" onClick={() => setView('list')}>{rd.back}</button>
            </div>
          </form>
        ) : (
          <div className="rd-edit-container">
            <div className="doc-tab-bar">
              {TABS.map((tb) => <button key={tb.id} className={`doc-tab-btn ${editTab === tb.id ? 'active' : ''}`} onClick={() => setEditTab(tb.id)} type="button">{tb.label}</button>)}
            </div>
            <form className="rd-tab-form" onSubmit={handleSaveTab}>
              {editTab === 'general' && (
                <div className="rp-form-grid">
                  <RO label={rd.company} value={companyLabel || companyId} />
                  <RO label={rd.documentType} value={documentType} />
                  <RO label={rd.companyCode} value={companyCode} />
                  <RO label={rd.ruleName} value={form.ruleName} />
                  <SelectField label={rd.process + ' *'} value={form.process} onChange={(v) => handleFormChange('process', v)} options={processes.map((p) => ({ value: p, label: p }))} placeholder={t.config.selectDocType} />
                  <Field label={rd.attachments} value={form.attachments} onChange={(v) => handleFormChange('attachments', v)} />
                  <Field label={rd.fileNameToAttach} value={form.fileNameToAttach} onChange={(v) => handleFormChange('fileNameToAttach', v)} />
                  <Field label={rd.extensionsToAttach} value={form.extensionsToAttach} onChange={(v) => handleFormChange('extensionsToAttach', v)} />
                  <div className="rp-field rp-field-full">
                    <span className="doc-field-label">{rd.xpathCondition}</span>
                    <textarea rows="3" value={form.xpathCondition} onChange={(e) => handleFormChange('xpathCondition', e.target.value)} />
                  </div>
                </div>
              )}
              {editTab === 'email' && (
                <div className="rp-form-grid">
                  <Field label={rd.emailTo} value={form.emailTo} onChange={(v) => handleFormChange('emailTo', v)} placeholder="email1@co.com;email2@co.com" />
                  <Field label={rd.subject} value={form.subject} onChange={(v) => handleFormChange('subject', v)} />
                  <FileUploadField label={rd.templateFile} value={form.templateFile} onChange={(v) => handleFormChange('templateFile', v)} hasDownload={!!form.templateFile} downloadLabel={rd.download} />
                </div>
              )}
              {editTab === 'webservice' && (
                <div className="rp-form-grid">
                  <div className="rp-field rp-field-full"><span className="doc-field-label">{rd.wsUrl}</span><input type="text" value={form.wsUrl} onChange={(e) => handleFormChange('wsUrl', e.target.value)} /></div>
                  <FileUploadField label={rd.wsHeaderTemplate} value={form.wsHeaderTemplate} onChange={(v) => handleFormChange('wsHeaderTemplate', v)} hasDownload={!!form.wsHeaderTemplate} downloadLabel={rd.download} />
                  <FileUploadField label={rd.wsBodyTemplate} value={form.wsBodyTemplate} onChange={(v) => handleFormChange('wsBodyTemplate', v)} hasDownload={!!form.wsBodyTemplate} downloadLabel={rd.download} />
                  <FileUploadField label={rd.wsTransformationTemplate} value={form.wsTransformationTemplate} onChange={(v) => handleFormChange('wsTransformationTemplate', v)} hasDownload={!!form.wsTransformationTemplate} downloadLabel={rd.download} />
                  <Field label={rd.wsContentTagName} value={form.wsContentTagName} onChange={(v) => handleFormChange('wsContentTagName', v)} />
                </div>
              )}
              {editTab === 'ftp' && (
                <div className="rp-form-grid">
                  <Field label={rd.ftpHostName} value={form.ftpHostName} onChange={(v) => handleFormChange('ftpHostName', v)} />
                  <Field label={rd.ftpPortNumber} value={form.ftpPortNumber} onChange={(v) => handleFormChange('ftpPortNumber', v)} />
                  <SelectField label={rd.ftpProtocol} value={form.ftpProtocol} onChange={(v) => handleFormChange('ftpProtocol', v)} options={ftpProtocols} />
                  <Field label={rd.ftpUserName} value={form.ftpUserName} onChange={(v) => handleFormChange('ftpUserName', v)} />
                  <div className="rp-field"><span className="doc-field-label">{rd.ftpPassword}</span><input type="password" value={form.ftpPassword} onChange={(e) => handleFormChange('ftpPassword', e.target.value)} /></div>
                  <FileUploadField label={rd.ftpPrivateKeyFile} value={form.ftpPrivateKeyFile} onChange={(v) => handleFormChange('ftpPrivateKeyFile', v)} hasDownload={!!form.ftpPrivateKeyFile} downloadLabel={rd.download} />
                  <Field label={rd.ftpRemoteDirectory} value={form.ftpRemoteDirectory} onChange={(v) => handleFormChange('ftpRemoteDirectory', v)} />
                </div>
              )}
              {editTab === 'as2' && (
                <div className="rp-form-grid">
                  <Field label={rd.as2From} value={form.as2From} onChange={(v) => handleFormChange('as2From', v)} />
                  <Field label={rd.as2To} value={form.as2To} onChange={(v) => handleFormChange('as2To', v)} />
                  <Field label={rd.as2Url} value={form.as2Url} onChange={(v) => handleFormChange('as2Url', v)} />
                  <FileUploadField label={rd.as2PublicKeyFile} value={form.as2PublicKeyFile} onChange={(v) => handleFormChange('as2PublicKeyFile', v)} hasDownload={!!form.as2PublicKeyFile} downloadLabel={rd.download} />
                  <FileUploadField label={rd.as2FromPublicKeyFile} value={form.as2FromPublicKeyFile} onChange={(v) => handleFormChange('as2FromPublicKeyFile', v)} hasDownload={!!form.as2FromPublicKeyFile} downloadLabel={rd.download} />
                </div>
              )}
              <div className="rp-form-actions">
                <button type="submit" className="primary-btn" disabled={saving}>{saving ? <span className="doc-spinner" /> : rd.save}</button>
                <button type="button" className="ghost-btn" onClick={() => { setView('list'); refreshList() }}>{rd.back}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    )
  }

  // ---- LIST VIEW ----
  return (
    <div className="rd-page">
      {alert && <Alert alert={alert} onClose={() => setAlert(null)} />}
      <form className="rp-filters-panel" onSubmit={handleFilter}>
        <div className="cfg-filters-header">
          <h2>{t.config.filters}</h2>
          {filtersCollapsed && <button type="button" className="ghost-btn" onClick={() => setFiltersCollapsed(false)}>{t.config.showFilters}</button>}
        </div>
        {!filtersCollapsed && (
          <div className="cfg-filter-fields">
            <CompanyAutocomplete value={companyId} onChange={(id, label) => { setCompanyId(id); setCompanyLabel(label); setDocumentType(''); setCodes([]); setCompanyCode(''); setRules(null); setDocTypes([]) }} label={t.config.company} placeholder={t.config.companyPlaceholder} noResults={t.config.noResults} />
            <label className="doc-field"><span className="doc-field-label">{t.config.documentType} *</span><select value={documentType} onChange={(e) => { setDocumentType(e.target.value); setCodes([]); setCompanyCode(''); setRules(null) }} disabled={!docTypes.length}>{docTypes.length !== 1 && <option value="">{t.config.selectDocType}</option>}{docTypes.map((dt) => <option key={dt.value} value={dt.value}>{dt.key}</option>)}</select></label>
            <label className="doc-field"><span className="doc-field-label">{t.config.companyCode} *</span><select value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} disabled={!codes.length}>{codes.length !== 1 && <option value="">{t.config.selectCode}</option>}{codes.map((cd) => <option key={cd.value} value={cd.value}>{cd.key}</option>)}</select></label>
            <button type="submit" className="primary-btn cfg-filter-btn" disabled={!companyId || !documentType || !companyCode || loading}>{loading ? <span className="doc-spinner" /> : t.config.filter}</button>
          </div>
        )}
        {filtersCollapsed && <div className="cfg-filter-summary"><span><strong>{t.config.company}:</strong> {companyLabel || companyId}</span><span><strong>{t.config.documentType}:</strong> {documentType}</span><span><strong>{t.config.companyCode}:</strong> {companyCode}</span></div>}
      </form>

      {rules && (
        <div className="rp-list-panel">
          <div className="rp-list-header"><h3>{rd.rules} ({rules.length})</h3><button className="primary-btn" onClick={handleNew}>{rd.addRule}</button></div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>{rd.ruleName}</th><th>{rd.actions}</th></tr></thead>
              <tbody>
                {rules.length === 0 && <tr><td colSpan="2" className="empty-row">{rd.noRules}</td></tr>}
                {rules.map((r) => (
                  <tr key={r.ruleName}>
                    <td className="td-name">{r.ruleName}</td>
                    <td className="td-actions">
                      <button className="icon-btn edit" onClick={() => handleEdit(r.ruleName)} title={rd.edit}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                      <button className="icon-btn delete" onClick={() => setDeleteModal(r.ruleName)} title={rd.deleteRule}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="modal-backdrop" onClick={() => setDeleteModal(null)}><div className="modal" onClick={(e) => e.stopPropagation()}>
          <h3>{rd.confirmDelete}</h3><p>{rd.confirmDeleteMsg} <strong>{deleteModal}</strong>?</p>
          <div className="modal-actions"><button className="ghost-btn" onClick={() => setDeleteModal(null)}>{rd.cancel}</button><button className="danger-btn" onClick={handleDelete}>{rd.deleteRule}</button></div>
        </div></div>
      )}
    </div>
  )
}

function Alert({ alert, onClose }) {
  return <div className={`doc-alert ${alert.type}`}><span>{alert.message}</span><button className="alert-close" onClick={onClose}>×</button></div>
}

function RO({ label, value }) {
  return <div className="rp-field"><span className="doc-field-label">{label}</span><input type="text" value={value} disabled className="rp-readonly" /></div>
}

function Field({ label, value, onChange, placeholder }) {
  return <label className="rp-field"><span className="doc-field-label">{label}</span><input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></label>
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <label className="rp-field"><span className="doc-field-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}

function FileUploadField({ label, value, onChange, hasDownload, downloadLabel }) {
  const ref = useRef(null)
  const open = useCallback(() => ref.current?.click(), [])
  const handleChange = useCallback(() => {
    const f = ref.current?.files[0]
    if (f) onChange(f.name)
  }, [onChange])
  return (
    <div className="rp-field rp-field-upload">
      <span className="doc-field-label">{label}</span>
      <div className="rp-upload-row">
        <input type="text" value={value} readOnly onClick={open} placeholder="..." />
        <input type="file" ref={ref} className="rp-file-hidden" accept=".xml,.txt,.zip,.rar,.rpt,.ppk,.key,.crt,.cer,.pfx,.p12,.sp,.xls,.xlsx,.xlst,.xsd,.htm,.html" onChange={handleChange} />
        <button type="button" className="ghost-btn rp-browse-btn" onClick={open}>📁</button>
        {hasDownload && <a href={`#download/${value}`} className="ghost-btn rp-download-btn" title={downloadLabel}>⬇️</a>}
      </div>
    </div>
  )
}

export default RuleDistributionPage
