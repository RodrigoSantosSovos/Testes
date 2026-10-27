import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '../../i18n/useI18n'
import {
  getCompanies, getCompany, createCompany, updateCompany, deleteCompany,
  getCompanyCodes, addCompanyCode, deleteCompanyCode,
  getCompanyBranches, addCompanyBranch, updateCompanyBranch, deleteCompanyBranch,
  generateCompanyId, getDocumentTypeOptions,
} from '../../services/companyService'
import './CompanyPage.css'

function CompanyPage() {
  const { t } = useI18n()
  const c = t.company

  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list')
  const [form, setForm] = useState({})
  const [isEdit, setIsEdit] = useState(false)
  const [editTab, setEditTab] = useState('company')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [search, setSearch] = useState('')

  const [codes, setCodes] = useState([])
  const [newCode, setNewCode] = useState({ documentType: '', companyCode: '' })
  const [branches, setBranches] = useState([])
  const [newBranch, setNewBranch] = useState({ companyCode: '', name: '' })
  const [editBranch, setEditBranch] = useState(null)
  const [deleteCodeModal, setDeleteCodeModal] = useState(null)
  const [deleteBranchModal, setDeleteBranchModal] = useState(null)

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message }); setTimeout(() => setAlert(null), 4000)
  }, [])

  const loadCompanies = useCallback(() => {
    getCompanies().then((data) => { setCompanies(data); setLoading(false) })
  }, [])

  useEffect(() => {
    getCompanies().then((data) => { setCompanies(data); setLoading(false) })
  }, [])

  const loadSubData = useCallback((companyId) => {
    getCompanyCodes(companyId).then(setCodes)
    getCompanyBranches(companyId).then(setBranches)
  }, [])

  const handleNew = useCallback(() => {
    setForm({ companyId: generateCompanyId(), name: '', partnerName: '', searchCode: '', emailAddress: '' })
    setIsEdit(false); setFormError(''); setView('form')
  }, [])

  const handleEdit = useCallback((companyId) => {
    getCompany(companyId).then((comp) => {
      if (comp) { setForm(comp); setIsEdit(true); setEditTab('company'); setFormError(''); setView('form'); loadSubData(companyId) }
    })
  }, [loadSubData])

  const handleSave = useCallback((e) => {
    e.preventDefault()
    if (!form.companyId?.trim() || !form.name?.trim()) { setFormError(c.requiredFields); return }
    setSaving(true)
    const action = isEdit ? updateCompany(form.companyId, form) : createCompany(form)
    action.then(() => {
      showAlert('success', isEdit ? c.updated : c.created)
      loadCompanies()
      if (!isEdit) { setIsEdit(true); setEditTab('company'); loadSubData(form.companyId) }
    }).catch(() => setFormError(c.saveError)).finally(() => setSaving(false))
  }, [form, isEdit, showAlert, c, loadCompanies, loadSubData])

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteModal) return
    deleteCompany(deleteModal).then(() => { showAlert('success', c.deleted); loadCompanies() })
    setDeleteModal(null)
  }, [deleteModal, showAlert, c, loadCompanies])

  const handleAddCode = useCallback((e) => {
    e.preventDefault()
    if (!newCode.documentType || !newCode.companyCode.trim()) return
    addCompanyCode(form.companyId, newCode.documentType, newCode.companyCode).then(() => {
      showAlert('success', c.codeAdded)
      getCompanyCodes(form.companyId).then(setCodes)
      setNewCode({ documentType: '', companyCode: '' })
    })
  }, [newCode, form.companyId, showAlert, c])

  const handleDeleteCode = useCallback(() => {
    if (!deleteCodeModal) return
    const cc = deleteCodeModal
    deleteCompanyCode(cc.companyId, cc.documentType, cc.companyCode).then(() => {
      showAlert('success', c.codeDeleted)
      getCompanyCodes(form.companyId).then(setCodes)
    })
    setDeleteCodeModal(null)
  }, [deleteCodeModal, form.companyId, showAlert, c])

  const handleAddBranch = useCallback((e) => {
    e.preventDefault()
    if (!newBranch.companyCode.trim()) return
    addCompanyBranch(form.companyId, newBranch.companyCode, newBranch.name).then(() => {
      showAlert('success', c.branchAdded)
      getCompanyBranches(form.companyId).then(setBranches)
      setNewBranch({ companyCode: '', name: '' })
    })
  }, [newBranch, form.companyId, showAlert, c])

  const handleSaveBranch = useCallback(() => {
    if (!editBranch) return
    updateCompanyBranch(editBranch.companyBranchId, editBranch.companyCode, editBranch.name).then(() => {
      showAlert('success', c.branchUpdated)
      getCompanyBranches(form.companyId).then(setBranches)
      setEditBranch(null)
    })
  }, [editBranch, form.companyId, showAlert, c])

  const handleDeleteBranch = useCallback(() => {
    if (!deleteBranchModal) return
    deleteCompanyBranch(deleteBranchModal).then(() => {
      showAlert('success', c.branchDeleted)
      getCompanyBranches(form.companyId).then(setBranches)
    })
    setDeleteBranchModal(null)
  }, [deleteBranchModal, form.companyId, showAlert, c])

  const filtered = companies.filter((co) => co.name.toLowerCase().includes(search.toLowerCase()) || co.companyId.toLowerCase().includes(search.toLowerCase()))
  const docTypeOptions = getDocumentTypeOptions()
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : '—'

  // ---- FORM VIEW ----
  if (view === 'form') {
    return (
      <div className="company-page">
        {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.message}</span><button className="alert-close" onClick={() => setAlert(null)}>×</button></div>}
        <div className="partner-form-toolbar">
          <button className="ghost-btn" onClick={() => { setView('list'); loadCompanies() }}>← {c.back}</button>
          <h2>{isEdit ? c.editCompany : c.addCompany}</h2>
        </div>
        {formError && <div className="doc-alert danger"><span>{formError}</span><button className="alert-close" onClick={() => setFormError('')}>×</button></div>}

        {isEdit ? (
          <div className="rd-edit-container">
            <div className="doc-tab-bar">
              <button className={`doc-tab-btn ${editTab === 'company' ? 'active' : ''}`} onClick={() => setEditTab('company')} type="button">{c.tabCompany}</button>
              <button className={`doc-tab-btn ${editTab === 'codes' ? 'active' : ''}`} onClick={() => setEditTab('codes')} type="button">{c.tabCompanyCode}</button>
              <button className={`doc-tab-btn ${editTab === 'branches' ? 'active' : ''}`} onClick={() => setEditTab('branches')} type="button">{c.tabCompanyBranch}</button>
            </div>
            <div className="company-tab-body">
              {editTab === 'company' && <CompanyForm form={form} onChange={(f, v) => setForm((p) => ({ ...p, [f]: v }))} onSave={handleSave} saving={saving} isEdit c={c} />}
              {editTab === 'codes' && (
                <div>
                  <form className="company-inline-form" onSubmit={handleAddCode}>
                    <select value={newCode.documentType} onChange={(e) => setNewCode((p) => ({ ...p, documentType: e.target.value }))}>
                      <option value="">{c.selectDocType}</option>
                      {docTypeOptions.map((d) => <option key={d.value} value={d.value}>{d.key}</option>)}
                    </select>
                    <input type="text" value={newCode.companyCode} onChange={(e) => setNewCode((p) => ({ ...p, companyCode: e.target.value }))} placeholder={c.companyCodePlaceholder} />
                    <button type="submit" className="primary-btn" disabled={!newCode.documentType || !newCode.companyCode.trim()}>{c.add}</button>
                  </form>
                  <table><thead><tr><th>{c.documentType}</th><th>{c.codeLabel}</th><th className="th-actions">{c.actions}</th></tr></thead>
                    <tbody>
                      {codes.length === 0 && <tr><td colSpan="3" className="empty-row">{c.noCodes}</td></tr>}
                      {codes.map((cc) => (
                        <tr key={`${cc.documentType}-${cc.companyCode}`}>
                          <td>{cc.documentTypeName}</td><td className="td-name">{cc.companyCode}</td>
                          <td className="td-actions"><button className="icon-btn delete" onClick={() => setDeleteCodeModal(cc)} title={c.deleteLabel}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {editTab === 'branches' && (
                <div>
                  <form className="company-inline-form" onSubmit={handleAddBranch}>
                    <input type="text" value={newBranch.companyCode} onChange={(e) => setNewBranch((p) => ({ ...p, companyCode: e.target.value }))} placeholder={c.branchCodePlaceholder} />
                    <input type="text" value={newBranch.name} onChange={(e) => setNewBranch((p) => ({ ...p, name: e.target.value }))} placeholder={c.branchNamePlaceholder} />
                    <button type="submit" className="primary-btn" disabled={!newBranch.companyCode.trim()}>{c.add}</button>
                  </form>
                  <table><thead><tr><th>ID</th><th>{c.codeLabel}</th><th>{c.branchName}</th><th className="th-actions">{c.actions}</th></tr></thead>
                    <tbody>
                      {branches.length === 0 && <tr><td colSpan="4" className="empty-row">{c.noBranches}</td></tr>}
                      {branches.map((b) => (
                        <tr key={b.companyBranchId}>
                          <td className="partner-td-id">{b.companyBranchId}</td>
                          <td>{editBranch?.companyBranchId === b.companyBranchId ? <input type="text" value={editBranch.companyCode} onChange={(e) => setEditBranch((p) => ({ ...p, companyCode: e.target.value }))} className="company-inline-input" /> : b.companyCode}</td>
                          <td>{editBranch?.companyBranchId === b.companyBranchId ? <input type="text" value={editBranch.name} onChange={(e) => setEditBranch((p) => ({ ...p, name: e.target.value }))} className="company-inline-input" /> : b.name || '—'}</td>
                          <td className="td-actions">
                            {editBranch?.companyBranchId === b.companyBranchId ? (
                              <><button className="icon-btn edit" onClick={handleSaveBranch} title={c.save}>✓</button><button className="icon-btn delete" onClick={() => setEditBranch(null)} title={c.cancel}>✗</button></>
                            ) : (
                              <><button className="icon-btn edit" onClick={() => setEditBranch({ ...b })} title={c.edit}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                              <button className="icon-btn delete" onClick={() => setDeleteBranchModal(b.companyBranchId)} title={c.deleteLabel}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button></>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <CompanyForm form={form} onChange={(f, v) => setForm((p) => ({ ...p, [f]: v }))} onSave={handleSave} saving={saving} isEdit={false} c={c} />
        )}

        {deleteCodeModal && <ConfirmModal title={c.confirmDelete} msg={`${c.confirmDeleteCodeMsg} ${deleteCodeModal.documentTypeName} / ${deleteCodeModal.companyCode}?`} warning={c.cascadeWarning} onCancel={() => setDeleteCodeModal(null)} onConfirm={handleDeleteCode} c={c} />}
        {deleteBranchModal && <ConfirmModal title={c.confirmDelete} msg={c.confirmDeleteBranchMsg} onCancel={() => setDeleteBranchModal(null)} onConfirm={handleDeleteBranch} c={c} />}
      </div>
    )
  }

  // ---- LIST VIEW ----
  return (
    <div className="company-page">
      {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.message}</span><button className="alert-close" onClick={() => setAlert(null)}>×</button></div>}
      <div className="partner-list-panel">
        <div className="partner-list-header">
          <div className="partner-list-header-left">
            <h3>{c.companies}</h3>
            <input type="text" className="partner-search" placeholder={c.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="primary-btn" onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            {c.addCompany}
          </button>
        </div>
        {loading ? <div className="partner-loading">{c.loading}</div> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Company ID</th><th>{c.nameLabel}</th><th>{c.creationDate}</th><th>{c.partnerNameLabel}</th><th>{c.searchCodeLabel}</th><th>Email</th><th className="th-actions">{c.actions}</th></tr></thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan="7" className="empty-row">{c.noCompanies}</td></tr>}
                {filtered.map((co) => (
                  <tr key={co.companyId}>
                    <td className="td-mono">{co.companyId}</td><td className="td-name">{co.name}</td><td>{fmtDate(co.creationDate)}</td>
                    <td>{co.partnerName || '—'}</td><td>{co.searchCode || '—'}</td><td>{co.emailAddress || '—'}</td>
                    <td className="td-actions">
                      <button className="icon-btn edit" onClick={() => handleEdit(co.companyId)} title={c.edit}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                      <button className="icon-btn delete" onClick={() => setDeleteModal(co.companyId)} title={c.deleteLabel}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {deleteModal && <ConfirmModal title={c.confirmDelete} msg={c.confirmDeleteMsg} onCancel={() => setDeleteModal(null)} onConfirm={handleDeleteConfirm} c={c} />}
    </div>
  )
}

function CompanyForm({ form, onChange, onSave, saving, isEdit, c }) {
  return (
    <form className="rp-form-panel" onSubmit={onSave}>
      <div className="rp-form-grid">
        <div className="rp-field"><span className="doc-field-label">Company ID *</span><input type="text" value={form.companyId} onChange={(e) => onChange('companyId', e.target.value)} disabled={isEdit} className={isEdit ? 'rp-readonly' : ''} /></div>
        <div className="rp-field"><span className="doc-field-label">{c.nameLabel} *</span><input type="text" value={form.name} onChange={(e) => onChange('name', e.target.value)} /></div>
        <div className="rp-field"><span className="doc-field-label">{c.partnerNameLabel}</span><input type="text" value={form.partnerName} onChange={(e) => onChange('partnerName', e.target.value)} /></div>
        <div className="rp-field"><span className="doc-field-label">{c.searchCodeLabel}</span><input type="text" value={form.searchCode} onChange={(e) => onChange('searchCode', e.target.value)} /></div>
        <div className="rp-field"><span className="doc-field-label">Email</span><input type="email" value={form.emailAddress} onChange={(e) => onChange('emailAddress', e.target.value)} /></div>
      </div>
      <div className="rp-form-actions">
        <button type="submit" className="primary-btn" disabled={saving}>{saving ? <span className="doc-spinner" /> : c.save}</button>
      </div>
    </form>
  )
}

function ConfirmModal({ title, msg, warning, onCancel, onConfirm, c }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}><div className="modal" onClick={(e) => e.stopPropagation()}>
      <h3>{title}</h3><p>{msg}</p>
      {warning && <div className="partner-dep-warning" style={{ color: 'var(--warning)' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><span>{warning}</span></div>}
      <div className="modal-actions"><button className="ghost-btn" onClick={onCancel}>{c.cancel}</button><button className="danger-btn" onClick={onConfirm}>{c.deleteLabel}</button></div>
    </div></div>
  )
}

export default CompanyPage
