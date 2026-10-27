import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { getPartners, getPartner, createPartner, updatePartner, deletePartner, checkDependencies } from '../../services/partnerService'
import './PartnerPage.css'

function PartnerPage() {
  const { t } = useI18n()
  const p = t.partner

  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list')
  const [form, setForm] = useState({ partnerId: 0, name: '' })
  const [isEdit, setIsEdit] = useState(false)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [depInfo, setDepInfo] = useState(null)
  const [search, setSearch] = useState('')

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }, [])

  const loadPartners = useCallback(() => {
    setLoading(true)
    getPartners().then((data) => { setPartners(data); setLoading(false) })
  }, [])

  useEffect(() => {
    getPartners().then((data) => { setPartners(data); setLoading(false) })
  }, [])

  const handleNew = useCallback(() => {
    setForm({ partnerId: 0, name: '' })
    setIsEdit(false)
    setFormError('')
    setView('form')
  }, [])

  const handleEdit = useCallback((partnerId) => {
    getPartner(partnerId).then((partner) => {
      if (partner) {
        setForm(partner)
        setIsEdit(true)
        setFormError('')
        setView('form')
      }
    })
  }, [])

  const handleSave = useCallback((e) => {
    e.preventDefault()
    if (!form.name.trim()) { setFormError(p.nameRequired); return }
    setSaving(true)
    const action = isEdit
      ? updatePartner(form.partnerId, form.name)
      : createPartner(form.name)
    action
      .then(() => {
        showAlert('success', isEdit ? p.updated : p.created)
        loadPartners()
        if (!isEdit) setView('list')
      })
      .catch(() => setFormError(p.saveError))
      .finally(() => setSaving(false))
  }, [form, isEdit, showAlert, p, loadPartners])

  const handleDeleteClick = useCallback((partner) => {
    checkDependencies(partner.partnerId).then((deps) => {
      setDepInfo(deps)
      setDeleteModal(partner)
    })
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteModal) return
    deletePartner(deleteModal.partnerId).then((result) => {
      if (result.success) {
        showAlert('success', p.deleted)
        loadPartners()
      } else if (result.hasDependencies) {
        showAlert('danger', p.deleteFkError)
      }
    })
    setDeleteModal(null)
    setDepInfo(null)
  }, [deleteModal, showAlert, p, loadPartners])

  const filtered = partners.filter((pt) =>
    pt.name.toLowerCase().includes(search.toLowerCase()) ||
    String(pt.partnerId).includes(search)
  )

  if (view === 'form') {
    return (
      <div className="partner-page">
        {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.message}</span><button className="alert-close" onClick={() => setAlert(null)}>×</button></div>}

        <div className="partner-form-toolbar">
          <button className="ghost-btn" onClick={() => setView('list')}>← {p.back}</button>
          <h2>{isEdit ? p.editPartner : p.addPartner}</h2>
        </div>

        {formError && <div className="doc-alert danger"><span>{formError}</span><button className="alert-close" onClick={() => setFormError('')}>×</button></div>}

        <form className="partner-form-panel" onSubmit={handleSave}>
          {isEdit && (
            <div className="partner-field">
              <span className="doc-field-label">ID</span>
              <input type="text" value={form.partnerId} disabled className="rp-readonly" />
            </div>
          )}

          <div className="partner-field">
            <span className="doc-field-label">{p.name} *</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              autoFocus
            />
          </div>

          <div className="partner-form-actions">
            <button type="submit" className="primary-btn" disabled={saving}>
              {saving ? <span className="doc-spinner" /> : p.save}
            </button>
            <button type="button" className="ghost-btn" onClick={() => setView('list')}>{p.back}</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="partner-page">
      {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.message}</span><button className="alert-close" onClick={() => setAlert(null)}>×</button></div>}

      <div className="partner-list-panel">
        <div className="partner-list-header">
          <div className="partner-list-header-left">
            <h3>{p.partners}</h3>
            <input
              type="text"
              className="partner-search"
              placeholder={p.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="primary-btn" onClick={handleNew}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            {p.addPartner}
          </button>
        </div>

        {loading ? (
          <div className="partner-loading">{p.loading}</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th className="partner-th-id">ID</th>
                  <th>{p.name}</th>
                  <th className="th-actions">{p.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan="3" className="empty-row">{p.noPartners}</td></tr>
                )}
                {filtered.map((pt) => (
                  <tr key={pt.partnerId}>
                    <td className="partner-td-id">{pt.partnerId}</td>
                    <td className="td-name">{pt.name}</td>
                    <td className="td-actions">
                      <button className="icon-btn edit" onClick={() => handleEdit(pt.partnerId)} title={p.edit}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDeleteClick(pt)} title={p.deletePartner}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteModal && (
        <div className="modal-backdrop" onClick={() => { setDeleteModal(null); setDepInfo(null) }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{p.confirmDelete}</h3>
            <p>{p.confirmDeleteMsg} <strong>{deleteModal.name}</strong> (ID: {deleteModal.partnerId})?</p>
            {depInfo && (depInfo.companies > 0 || depInfo.users > 0 || depInfo.workflows > 0) && (
              <div className="partner-dep-warning">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                <div>
                  <strong>{p.hasDependencies}</strong>
                  <ul>
                    {depInfo.companies > 0 && <li>{depInfo.companies} {p.depCompanies}</li>}
                    {depInfo.users > 0 && <li>{depInfo.users} {p.depUsers}</li>}
                    {depInfo.workflows > 0 && <li>{depInfo.workflows} {p.depWorkflows}</li>}
                  </ul>
                </div>
              </div>
            )}
            <div className="modal-actions">
              <button className="ghost-btn" onClick={() => { setDeleteModal(null); setDepInfo(null) }}>{p.cancel}</button>
              <button className="danger-btn" onClick={handleDeleteConfirm}>{p.deletePartner}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PartnerPage
