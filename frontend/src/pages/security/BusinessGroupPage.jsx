import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '../../i18n/useI18n'
import {
  getGroups, getGroup, createGroup, updateGroup,
  getGroupAuthorizations, getAvailableAuthorizations,
  addAuthorization, removeAuthorization,
} from '../../services/businessGroupService'
import './BusinessGroupPage.css'

function BusinessGroupPage() {
  const { t } = useI18n()
  const bg = t.businessGroup

  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list')
  const [form, setForm] = useState({ groupId: 0, name: '', description: '' })
  const [isEdit, setIsEdit] = useState(false)
  const [editTab, setEditTab] = useState('group')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)

  const [assigned, setAssigned] = useState([])
  const [available, setAvailable] = useState([])
  const [selectedAuthId, setSelectedAuthId] = useState('')
  const [deleteAuthModal, setDeleteAuthModal] = useState(null)

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message }); setTimeout(() => setAlert(null), 4000)
  }, [])

  const loadGroups = useCallback(() => { getGroups().then(setGroups) }, [])
  useEffect(() => { getGroups().then((d) => { setGroups(d); setLoading(false) }) }, [])

  const loadAuths = useCallback((groupId) => {
    getGroupAuthorizations(groupId).then(setAssigned)
    getAvailableAuthorizations(groupId).then(setAvailable)
  }, [])

  const handleNew = useCallback(() => {
    setForm({ groupId: 0, name: '', description: '' })
    setIsEdit(false); setFormError(''); setView('form')
  }, [])

  const handleEdit = useCallback((groupId) => {
    getGroup(groupId).then((g) => {
      if (g) { setForm(g); setIsEdit(true); setEditTab('group'); setFormError(''); setView('form'); loadAuths(groupId) }
    })
  }, [loadAuths])

  const handleSave = useCallback((e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.description.trim()) { setFormError(bg.requiredFields); return }
    setSaving(true)
    const action = isEdit ? updateGroup(form.groupId, form.name, form.description) : createGroup(form.name, form.description)
    action.then((res) => {
      showAlert('success', isEdit ? bg.updated : bg.created)
      loadGroups()
      if (!isEdit && res.groupId) {
        setForm({ groupId: res.groupId, name: form.name, description: form.description })
        setIsEdit(true); setEditTab('group'); loadAuths(res.groupId)
      }
    }).catch(() => setFormError(bg.saveError)).finally(() => setSaving(false))
  }, [form, isEdit, showAlert, bg, loadGroups, loadAuths])

  const handleAddAuth = useCallback((e) => {
    e.preventDefault()
    if (!selectedAuthId) return
    addAuthorization(form.groupId, Number(selectedAuthId)).then(() => {
      showAlert('success', bg.authAdded)
      loadAuths(form.groupId)
      setSelectedAuthId('')
    })
  }, [selectedAuthId, form.groupId, showAlert, bg, loadAuths])

  const handleRemoveAuth = useCallback(() => {
    if (!deleteAuthModal) return
    removeAuthorization(form.groupId, deleteAuthModal.authorizationId).then(() => {
      showAlert('success', bg.authRemoved)
      loadAuths(form.groupId)
    })
    setDeleteAuthModal(null)
  }, [deleteAuthModal, form.groupId, showAlert, bg, loadAuths])

  // ---- FORM VIEW ----
  if (view === 'form') {
    return (
      <div className="bg-page">
        {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.message}</span><button className="alert-close" onClick={() => setAlert(null)}>×</button></div>}
        <div className="partner-form-toolbar"><button className="ghost-btn" onClick={() => { setView('list'); loadGroups() }}>← {bg.back}</button><h2>{isEdit ? bg.editGroup : bg.addGroup}</h2></div>
        {formError && <div className="doc-alert danger"><span>{formError}</span><button className="alert-close" onClick={() => setFormError('')}>×</button></div>}

        {isEdit ? (
          <div className="rd-edit-container">
            <div className="doc-tab-bar">
              <button className={`doc-tab-btn ${editTab === 'group' ? 'active' : ''}`} onClick={() => setEditTab('group')} type="button">{bg.tabGroup}</button>
              <button className={`doc-tab-btn ${editTab === 'auth' ? 'active' : ''}`} onClick={() => setEditTab('auth')} type="button">{bg.tabAuthorizations}</button>
            </div>
            <div className="company-tab-body">
              {editTab === 'group' && (
                <form className="rp-form-panel bg-form-inner" onSubmit={handleSave}>
                  <div className="rp-form-grid bg-form-grid">
                    <div className="rp-field"><span className="doc-field-label">ID</span><input type="text" value={form.groupId} disabled className="rp-readonly" /></div>
                    <div className="rp-field"><span className="doc-field-label">{bg.name} *</span><input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
                    <div className="rp-field rp-field-full"><span className="doc-field-label">{bg.description} *</span><input type="text" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></div>
                  </div>
                  <div className="rp-form-actions"><button type="submit" className="primary-btn" disabled={saving}>{saving ? <span className="doc-spinner" /> : bg.save}</button></div>
                </form>
              )}
              {editTab === 'auth' && (
                <div>
                  <form className="company-inline-form" onSubmit={handleAddAuth}>
                    <select value={selectedAuthId} onChange={(e) => setSelectedAuthId(e.target.value)}>
                      <option value="">{bg.selectAuthorization}</option>
                      {available.map((a) => <option key={a.authorizationId} value={a.authorizationId}>{a.name}</option>)}
                    </select>
                    <button type="submit" className="primary-btn" disabled={!selectedAuthId}>{bg.addAuth}</button>
                  </form>
                  {available.length === 0 && assigned.length > 0 && <p className="bg-all-assigned">{bg.allAssigned}</p>}
                  <table><thead><tr><th>{bg.authName}</th><th>{bg.authDescription}</th><th className="th-actions">{bg.actions}</th></tr></thead>
                    <tbody>
                      {assigned.length === 0 && <tr><td colSpan="3" className="empty-row">{bg.noAuthorizations}</td></tr>}
                      {assigned.map((a) => (
                        <tr key={a.authorizationId}>
                          <td className="td-name td-mono">{a.name}</td>
                          <td>{a.description}</td>
                          <td className="td-actions"><button className="icon-btn delete" onClick={() => setDeleteAuthModal(a)} title={bg.removeAuth}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form className="partner-form-panel" onSubmit={handleSave}>
            <div className="partner-field"><span className="doc-field-label">{bg.name} *</span><input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus /></div>
            <div className="partner-field"><span className="doc-field-label">{bg.description} *</span><input type="text" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></div>
            <div className="partner-form-actions"><button type="submit" className="primary-btn" disabled={saving}>{saving ? <span className="doc-spinner" /> : bg.save}</button><button type="button" className="ghost-btn" onClick={() => setView('list')}>{bg.back}</button></div>
          </form>
        )}

        {deleteAuthModal && (
          <div className="modal-backdrop" onClick={() => setDeleteAuthModal(null)}><div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{bg.confirmRemoveAuth}</h3>
            <p>{bg.confirmRemoveAuthMsg} <strong>{deleteAuthModal.name}</strong>?</p>
            <div className="modal-actions"><button className="ghost-btn" onClick={() => setDeleteAuthModal(null)}>{bg.cancel}</button><button className="danger-btn" onClick={handleRemoveAuth}>{bg.removeAuth}</button></div>
          </div></div>
        )}
      </div>
    )
  }

  // ---- LIST VIEW ----
  return (
    <div className="bg-page">
      {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.message}</span><button className="alert-close" onClick={() => setAlert(null)}>×</button></div>}
      <div className="partner-list-panel">
        <div className="partner-list-header">
          <h3>{bg.groups}</h3>
          <button className="primary-btn" onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>{bg.addGroup}
          </button>
        </div>
        {loading ? <div className="partner-loading">{bg.loading}</div> : (
          <div className="table-wrapper">
            <table><thead><tr><th>{bg.name}</th><th>{bg.description}</th><th className="th-actions">{bg.actions}</th></tr></thead>
              <tbody>
                {groups.length === 0 && <tr><td colSpan="3" className="empty-row">{bg.noGroups}</td></tr>}
                {groups.map((g) => (
                  <tr key={g.groupId}>
                    <td className="td-name">{g.name}{g.name === 'system_administrator' && <span className="bg-admin-badge">admin</span>}</td>
                    <td>{g.description}</td>
                    <td className="td-actions"><button className="icon-btn edit" onClick={() => handleEdit(g.groupId)} title={bg.edit}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default BusinessGroupPage
