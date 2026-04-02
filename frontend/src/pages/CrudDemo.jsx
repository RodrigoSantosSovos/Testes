import { useState, useCallback } from 'react'
import './CrudDemo.css'

const EMPTY_FORM = {
  name: '',
  email: '',
  role: '',
  department: '',
  phone: '',
  salary: '',
  startDate: '',
  bio: '',
  active: true,
}

const SEED = [
  { id: 1, name: 'Ana Silva', email: 'ana@empresa.com', role: 'Desenvolvedora', department: 'Engenharia', phone: '(11) 99000-1234', salary: '12500', startDate: '2023-03-15', bio: 'Especialista em React e Node.js com 5 anos de experiência.', active: true },
  { id: 2, name: 'Carlos Mendes', email: 'carlos@empresa.com', role: 'Designer', department: 'Produto', phone: '(21) 98800-5678', salary: '9800', startDate: '2022-08-01', bio: 'UI/UX designer focado em design systems.', active: true },
  { id: 3, name: 'Beatriz Rocha', email: 'beatriz@empresa.com', role: 'Gerente de Projetos', department: 'Operações', phone: '(31) 97700-9012', salary: '15200', startDate: '2021-01-10', bio: 'PMP certificada, 10+ anos liderando equipes ágeis.', active: false },
  { id: 4, name: 'Daniel Oliveira', email: 'daniel@empresa.com', role: 'Analista de Dados', department: 'Business Intelligence', phone: '(41) 96600-3456', salary: '11000', startDate: '2023-11-20', bio: 'Python, SQL e Power BI.', active: true },
  { id: 5, name: 'Fernanda Costa', email: 'fernanda@empresa.com', role: 'QA Engineer', department: 'Engenharia', phone: '(51) 95500-7890', salary: '10200', startDate: '2024-02-05', bio: 'Automação de testes com Cypress e Playwright.', active: true },
]

const ROLES = ['Desenvolvedora', 'Designer', 'Gerente de Projetos', 'Analista de Dados', 'QA Engineer', 'DevOps', 'Product Owner']
const DEPARTMENTS = ['Engenharia', 'Produto', 'Operações', 'Business Intelligence', 'Marketing', 'RH']

function CrudDemo() {
  const [rows, setRows] = useState(SEED)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [alert, setAlert] = useState(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 4

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3500)
  }, [])

  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase()),
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const pageRows = filtered.slice((safePage - 1) * perPage, safePage * perPage)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.role) {
      showAlert('danger', 'Preencha os campos obrigatórios: Nome, E-mail e Cargo.')
      return
    }
    if (editingId) {
      setRows((r) => r.map((row) => (row.id === editingId ? { ...form, id: editingId } : row)))
      showAlert('success', `Registro de "${form.name}" atualizado com sucesso.`)
    } else {
      const id = Math.max(0, ...rows.map((r) => r.id)) + 1
      setRows((r) => [...r, { ...form, id }])
      showAlert('success', `Registro de "${form.name}" criado com sucesso.`)
    }
    resetForm()
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  const startEdit = (row) => {
    setForm({ ...row })
    setEditingId(row.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const confirmDelete = (row) => {
    setDeleteTarget(row)
    setModalOpen(true)
  }

  const executeDelete = () => {
    setRows((r) => r.filter((row) => row.id !== deleteTarget.id))
    showAlert('warning', `Registro de "${deleteTarget.name}" removido.`)
    setModalOpen(false)
    setDeleteTarget(null)
    if (editingId === deleteTarget.id) resetForm()
  }

  const fmt = (v) =>
    Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="crud-demo">
      {alert && (
        <div className={`crud-alert ${alert.type}`}>
          <span>{alert.message}</span>
          <button className="alert-close" onClick={() => setAlert(null)}>×</button>
        </div>
      )}

      {/* ---------- STATS CARDS ---------- */}
      <section className="crud-cards">
        <article className="stat-card">
          <div className="stat-icon primary">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p className="stat-label">Total Registros</p>
            <h3 className="stat-value">{rows.length}</h3>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon success">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <p className="stat-label">Ativos</p>
            <h3 className="stat-value">{rows.filter((r) => r.active).length}</h3>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon danger">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p className="stat-label">Inativos</p>
            <h3 className="stat-value">{rows.filter((r) => !r.active).length}</h3>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon warning">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <p className="stat-label">Folha Mensal</p>
            <h3 className="stat-value">{fmt(rows.reduce((s, r) => s + Number(r.salary || 0), 0))}</h3>
          </div>
        </article>
      </section>

      {/* ---------- FORM ---------- */}
      <section className="crud-panel">
        <div className="crud-panel-head">
          <h2>{editingId ? 'Editar Registro' : 'Novo Registro'}</h2>
          {editingId && (
            <button className="ghost-btn" onClick={resetForm}>Cancelar Edição</button>
          )}
        </div>

        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="form-row cols-3">
            <label className="field">
              <span className="field-label">Nome <em>*</em></span>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nome completo" />
            </label>
            <label className="field">
              <span className="field-label">E-mail <em>*</em></span>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@empresa.com" />
            </label>
            <label className="field">
              <span className="field-label">Telefone</span>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="(00) 00000-0000" />
            </label>
          </div>

          <div className="form-row cols-4">
            <label className="field">
              <span className="field-label">Cargo <em>*</em></span>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="">Selecione...</option>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Departamento</span>
              <select name="department" value={form.department} onChange={handleChange}>
                <option value="">Selecione...</option>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Salário (R$)</span>
              <input name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="0,00" />
            </label>
            <label className="field">
              <span className="field-label">Data de Início</span>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
            </label>
          </div>

          <div className="form-row cols-1">
            <label className="field">
              <span className="field-label">Biografia</span>
              <textarea name="bio" rows="3" value={form.bio} onChange={handleChange} placeholder="Breve descrição do colaborador..." />
            </label>
          </div>

          <div className="form-row cols-1">
            <label className="field-inline">
              <span className="toggle-track">
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                <span className="toggle-thumb" />
              </span>
              <span className="field-label">Ativo</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn btn-lg">
              {editingId ? 'Salvar Alterações' : 'Adicionar Registro'}
            </button>
            <button type="button" className="ghost-btn btn-lg" onClick={resetForm}>Limpar</button>
          </div>
        </form>
      </section>

      {/* ---------- BUTTON SHOWCASE ---------- */}
      <section className="crud-panel">
        <div className="crud-panel-head">
          <h2>Botões &amp; Badges</h2>
        </div>
        <div className="showcase-row">
          <button className="primary-btn btn-sm">Small</button>
          <button className="primary-btn">Default</button>
          <button className="primary-btn btn-lg">Large</button>
          <button className="success-btn">Success</button>
          <button className="danger-btn">Danger</button>
          <button className="warning-btn">Warning</button>
          <button className="ghost-btn">Ghost</button>
          <button className="outline-btn">Outline</button>
          <button className="primary-btn" disabled>Disabled</button>
        </div>
        <div className="showcase-row" style={{ marginTop: 14 }}>
          <span className="badge success">Ativo</span>
          <span className="badge danger">Inativo</span>
          <span className="badge primary">Novo</span>
          <span className="badge warning">Pendente</span>
        </div>
      </section>

      {/* ---------- TABLE ---------- */}
      <section className="crud-panel">
        <div className="crud-panel-head">
          <h2>Registros</h2>
          <input
            className="table-search"
            type="text"
            placeholder="Filtrar por nome, e-mail ou cargo..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Salário</th>
                <th>Status</th>
                <th className="th-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-row">Nenhum registro encontrado.</td>
                </tr>
              )}
              {pageRows.map((row) => (
                <tr key={row.id} className={editingId === row.id ? 'row-editing' : ''}>
                  <td className="td-name">{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.role}</td>
                  <td>{row.department}</td>
                  <td>{fmt(row.salary)}</td>
                  <td>
                    <span className={`badge ${row.active ? 'success' : 'danger'}`}>
                      {row.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="td-actions">
                    <button className="icon-btn edit" title="Editar" onClick={() => startEdit(row)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button className="icon-btn delete" title="Excluir" onClick={() => confirmDelete(row)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="ghost-btn btn-sm"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ← Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`page-btn ${safePage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="ghost-btn btn-sm"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Próximo →
            </button>
          </div>
        )}
      </section>

      {/* ---------- CONFIRM MODAL ---------- */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar Exclusão</h3>
            <p>
              Tem certeza que deseja excluir o registro de{' '}
              <strong>{deleteTarget?.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button className="ghost-btn" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="danger-btn" onClick={executeDelete}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrudDemo
