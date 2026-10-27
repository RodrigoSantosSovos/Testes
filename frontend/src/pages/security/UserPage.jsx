import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '../../i18n/useI18n'
import {
  getUsers, getUser, createUser, updateUser, deleteUser,
  lockUser, unlockUser, getUserCompanies, addUserCompany, removeUserCompany,
  getGroups, getCompaniesForAssign,
} from '../../services/userService'
import './UserPage.css'

function UserPage() {
  const { t } = useI18n()
  const u = t.userPage

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list')
  const [form, setForm] = useState({})
  const [isEdit, setIsEdit] = useState(false)
  const [editTab, setEditTab] = useState('user')
  const [formErrors, setFormErrors] = useState([])
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [showPw, setShowPw] = useState(false)

  const [userCompanies, setUserCompanies] = useState([])
  const [newCompanyId, setNewCompanyId] = useState('')

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message }); setTimeout(() => setAlert(null), 4000)
  }, [])

  const loadUsers = useCallback(() => { getUsers().then(setUsers) }, [])
  useEffect(() => { getUsers().then((d) => { setUsers(d); setLoading(false) }) }, [])

  const groups = getGroups()
  const companiesForAssign = getCompaniesForAssign()
  const fmtDate = (d) => d ? new Date(d).toLocaleString() : '—'

  const handleNew = useCallback(() => {
    setForm({ tfGroupId: groups[0]?.groupId || 1, name: '', email: '', phone: '', mobile: '', password: '', confirmPassword: '', isAproved: true, isLockedOut: false })
    setIsEdit(false); setFormErrors([]); setShowPw(false); setView('form')
  }, [groups])

  const handleEdit = useCallback((id) => {
    getUser(id).then((usr) => {
      if (usr) {
        setForm({ ...usr, password: '', confirmPassword: '' })
        setIsEdit(true); setEditTab('user'); setFormErrors([]); setShowPw(false); setView('form')
        getUserCompanies(id).then(setUserCompanies)
      }
    })
  }, [])

  const handleSave = useCallback((e) => {
    e.preventDefault(); setFormErrors([])
    setSaving(true)
    const action = isEdit ? updateUser(form.tfUserId, form) : createUser(form)
    action.then((res) => {
      if (res.success) {
        showAlert('success', isEdit ? u.updated : u.created)
        loadUsers()
        if (!isEdit && res.tfUserId) {
          getUser(res.tfUserId).then((usr) => {
            setForm({ ...usr, password: '', confirmPassword: '' })
            setIsEdit(true); setEditTab('user')
            getUserCompanies(res.tfUserId).then(setUserCompanies)
          })
        }
      } else {
        setFormErrors(res.errors || [])
      }
    }).finally(() => setSaving(false))
  }, [form, isEdit, showAlert, u, loadUsers])

  const handleModalConfirm = useCallback(() => {
    if (!modal) return
    const { action, id } = modal
    const fn = action === 'delete' ? deleteUser(id) : action === 'lock' ? lockUser(id) : unlockUser(id)
    fn.then(() => {
      showAlert('success', action === 'delete' ? u.deleted : action === 'lock' ? u.locked : u.unlocked)
      loadUsers()
    })
    setModal(null)
  }, [modal, showAlert, u, loadUsers])

  const handleAddCompany = useCallback((e) => {
    e.preventDefault()
    if (!newCompanyId) return
    addUserCompany(form.tfUserId, newCompanyId).then((res) => {
      if (res.success) {
        showAlert('success', u.companyAdded)
        getUserCompanies(form.tfUserId).then(setUserCompanies)
        setNewCompanyId('')
      } else showAlert('danger', u.companyAlreadyAssigned)
    })
  }, [newCompanyId, form.tfUserId, showAlert, u])

  const handleRemoveCompany = useCallback((companyId) => {
    removeUserCompany(form.tfUserId, companyId).then(() => {
      showAlert('success', u.companyRemoved)
      getUserCompanies(form.tfUserId).then(setUserCompanies)
    })
  }, [form.tfUserId, showAlert, u])

  const errorMsg = (code) => u.errors?.[code] || code

  const filtered = users.filter((usr) =>
    usr.name.toLowerCase().includes(search.toLowerCase()) ||
    usr.email.toLowerCase().includes(search.toLowerCase())
  )

  // ---- FORM VIEW ----
  if (view === 'form') {
    return (
      <div className="user-page">
        {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.message}</span><button className="alert-close" onClick={() => setAlert(null)}>×</button></div>}
        <div className="partner-form-toolbar"><button className="ghost-btn" onClick={() => { setView('list'); loadUsers() }}>← {u.back}</button><h2>{isEdit ? u.editUser : u.addUser}</h2></div>
        {formErrors.length > 0 && <div className="doc-alert danger"><span>{formErrors.map(errorMsg).join('. ')}</span><button className="alert-close" onClick={() => setFormErrors([])}>×</button></div>}

        {isEdit ? (
          <div className="rd-edit-container">
            <div className="doc-tab-bar">
              <button className={`doc-tab-btn ${editTab === 'user' ? 'active' : ''}`} onClick={() => setEditTab('user')} type="button">{u.tabUser}</button>
              <button className={`doc-tab-btn ${editTab === 'companies' ? 'active' : ''}`} onClick={() => setEditTab('companies')} type="button">{u.tabCompanyUser}</button>
            </div>
            <div className="company-tab-body">
              {editTab === 'user' && <UserForm form={form} setForm={setForm} groups={groups} onSave={handleSave} saving={saving} isEdit showPw={showPw} setShowPw={setShowPw} u={u} />}
              {editTab === 'companies' && (
                <div>
                  <form className="company-inline-form" onSubmit={handleAddCompany}>
                    <select value={newCompanyId} onChange={(e) => setNewCompanyId(e.target.value)}>
                      <option value="">{u.selectCompany}</option>
                      {companiesForAssign.map((c) => <option key={c.value} value={c.value}>{c.text}</option>)}
                    </select>
                    <button type="submit" className="primary-btn" disabled={!newCompanyId}>{u.addCompany}</button>
                  </form>
                  <table><thead><tr><th>Company ID</th><th>{u.companyName}</th><th className="th-actions">{u.actions}</th></tr></thead>
                    <tbody>
                      {userCompanies.length === 0 && <tr><td colSpan="3" className="empty-row">{u.noCompanies}</td></tr>}
                      {userCompanies.map((cu) => (
                        <tr key={cu.companyId}>
                          <td className="td-mono">{cu.companyId}</td><td className="td-name">{cu.companyName}</td>
                          <td className="td-actions"><button className="icon-btn delete" onClick={() => handleRemoveCompany(cu.companyId)} title={u.remove}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <UserForm form={form} setForm={setForm} groups={groups} onSave={handleSave} saving={saving} isEdit={false} showPw={showPw} setShowPw={setShowPw} u={u} />
        )}
      </div>
    )
  }

  // ---- LIST VIEW ----
  return (
    <div className="user-page">
      {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.message}</span><button className="alert-close" onClick={() => setAlert(null)}>×</button></div>}
      <div className="partner-list-panel">
        <div className="partner-list-header">
          <div className="partner-list-header-left"><h3>{u.users}</h3><input type="text" className="partner-search" placeholder={u.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <button className="primary-btn" onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>{u.addUser}
          </button>
        </div>
        {loading ? <div className="partner-loading">{u.loading}</div> : (
          <div className="table-wrapper">
            <table><thead><tr><th>{u.group}</th><th>{u.name}</th><th>Email</th><th>{u.lastLogin}</th><th>{u.lockedOut}</th><th className="th-actions">{u.actions}</th></tr></thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan="6" className="empty-row">{u.noUsers}</td></tr>}
                {filtered.map((usr) => (
                  <tr key={usr.tfUserId} className={usr.isLockedOut ? 'user-row-locked' : ''}>
                    <td><span className="badge primary">{groups.find((g) => g.groupId === usr.tfGroupId)?.description || usr.tfGroupId}</span></td>
                    <td className="td-name">{usr.name}</td>
                    <td>{usr.email}</td>
                    <td>{fmtDate(usr.lastLoginDate)}</td>
                    <td>{usr.isLockedOut ? <span className="badge danger">{u.yes}</span> : <span className="badge success">{u.no}</span>}</td>
                    <td className="td-actions">
                      <button className="icon-btn edit" onClick={() => handleEdit(usr.tfUserId)} title={u.edit}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                      <button className="icon-btn delete" onClick={() => setModal({ action: 'delete', id: usr.tfUserId, name: usr.name })} title={u.deleteUser}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                      {usr.isLockedOut
                        ? <button className="icon-btn user-unlock" onClick={() => setModal({ action: 'unlock', id: usr.tfUserId, name: usr.name })} title={u.unlock}>🔓</button>
                        : <button className="icon-btn user-lock" onClick={() => setModal({ action: 'lock', id: usr.tfUserId, name: usr.name })} title={u.lock}>🔒</button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}><div className="modal" onClick={(e) => e.stopPropagation()}>
          <h3>{modal.action === 'delete' ? u.confirmDelete : modal.action === 'lock' ? u.confirmLock : u.confirmUnlock}</h3>
          <p>{modal.action === 'delete' ? u.confirmDeleteMsg : modal.action === 'lock' ? u.confirmLockMsg : u.confirmUnlockMsg} <strong>{modal.name}</strong>?</p>
          <div className="modal-actions"><button className="ghost-btn" onClick={() => setModal(null)}>{u.cancel}</button><button className={modal.action === 'delete' ? 'danger-btn' : 'primary-btn'} onClick={handleModalConfirm}>{u.confirm}</button></div>
        </div></div>
      )}
    </div>
  )
}

function UserForm({ form, setForm, groups, onSave, saving, isEdit, showPw, setShowPw, u }) {
  const onChange = (f, v) => setForm((p) => ({ ...p, [f]: v }))
  return (
    <form className="rp-form-panel" onSubmit={onSave}>
      <div className="rp-form-grid">
        <div className="rp-field"><span className="doc-field-label">{u.group} *</span>
          <select value={form.tfGroupId} onChange={(e) => onChange('tfGroupId', Number(e.target.value))}>
            {groups.map((g) => <option key={g.groupId} value={g.groupId}>{g.description}</option>)}
          </select>
        </div>
        <div className="rp-field"><span className="doc-field-label">Email *</span><input type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} /></div>
        <div className="rp-field"><span className="doc-field-label">{u.name} *</span><input type="text" value={form.name} onChange={(e) => onChange('name', e.target.value)} /></div>
        <div className="rp-field"><span className="doc-field-label">{u.phone} *</span><input type="tel" value={form.phone} onChange={(e) => onChange('phone', e.target.value)} maxLength={20} /></div>
        <div className="rp-field"><span className="doc-field-label">{u.mobile}</span><input type="tel" value={form.mobile} onChange={(e) => onChange('mobile', e.target.value)} maxLength={20} /></div>
        <div className="rp-field"><span className="doc-field-label">{u.password} {!isEdit && '*'}</span>
          <div className="user-pw-wrap"><input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => onChange('password', e.target.value)} /><button type="button" className="user-pw-toggle" onClick={() => setShowPw((v) => !v)}>{showPw ? '🙈' : '👁️'}</button></div>
          <small className="user-pw-hint">{u.passwordHint}</small>
        </div>
        <div className="rp-field"><span className="doc-field-label">{u.confirmPassword} {!isEdit && '*'}</span><input type={showPw ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => onChange('confirmPassword', e.target.value)} /></div>
        <div className="rp-field-check"><input type="checkbox" checked={form.isAproved} onChange={(e) => onChange('isAproved', e.target.checked)} /><span>{u.approved}</span></div>
        <div className="rp-field-check"><input type="checkbox" checked={form.isLockedOut} onChange={(e) => onChange('isLockedOut', e.target.checked)} /><span>{u.lockedOut}</span></div>
      </div>
      <div className="rp-form-actions">
        <button type="submit" className="primary-btn" disabled={saving}>{saving ? <span className="doc-spinner" /> : u.save}</button>
      </div>
    </form>
  )
}

export default UserPage
