import { useState, useCallback } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { searchDocuments, sendToQueue, purgeDocuments, reprintPdf, downloadReturns, getDocTypes } from '../../services/utilityService'
import './UtilityPages.css'

function UtilitySearchPage() {
  const { t } = useI18n()
  const u = t.util

  const [mode, setMode] = useState('period')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [documentId, setDocumentId] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [serie, setSerie] = useState('')
  const [numero, setNumero] = useState('')
  const [fileIds, setFileIds] = useState('')
  const [docType, setDocType] = useState('')
  const [owner, setOwner] = useState('')
  const [ownerSearchCode, setOwnerSearchCode] = useState('')
  const [isHistorical, setIsHistorical] = useState(false)

  const [results, setResults] = useState(null)
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [queueName, setQueueName] = useState('TFClientSendServer1')
  const [actionLoading, setActionLoading] = useState('')
  const [logs, setLogs] = useState([])

  const showAlert = useCallback((type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000) }, [])
  const addLog = useCallback((msg) => { setLogs((p) => [{ time: new Date().toLocaleTimeString(), msg }, ...p].slice(0, 50)) }, [])

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    setLoading(true)
    searchDocuments({ mode, dateFrom, dateTo, documentId, cnpj, serie, numero, fileIds, docType, owner, ownerSearchCode, isHistorical })
      .then((res) => { setResults(res); setSelected([]); addLog(`Busca: ${res.total} documentos encontrados`) })
      .finally(() => setLoading(false))
  }, [mode, dateFrom, dateTo, documentId, cnpj, serie, numero, fileIds, docType, owner, ownerSearchCode, isHistorical, addLog])

  const runAction = useCallback((name, fn) => {
    if (selected.length === 0) { showAlert('warning', u.noDocsSelected); return }
    setActionLoading(name)
    fn(selected).then((res) => { showAlert('success', res.message); addLog(res.message) }).finally(() => setActionLoading(''))
  }, [selected, showAlert, u, addLog])

  const toggleAll = () => setSelected((p) => p.length === results?.documents?.length ? [] : results?.documents?.map((d) => d.documentId) || [])
  const toggleOne = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
  const fmtDate = (d) => d ? new Date(d).toLocaleString() : '—'

  return (
    <div className="util-page">
      {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.msg}</span></div>}

      <div className="util-panel">
        <h3>{u.searchTitle}</h3>
        <form className="util-search-form" onSubmit={handleSearch}>
          <div className="util-modes">
            {['period', 'documentId', 'data', 'file'].map((m) => (
              <label key={m} className="util-radio"><input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} />{u[`mode_${m}`]}</label>
            ))}
          </div>

          <div className="util-fields">
            {mode === 'period' && (<>
              <label className="util-field"><span>{u.dateFrom}</span><input type="datetime-local" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></label>
              <label className="util-field"><span>{u.dateTo}</span><input type="datetime-local" value={dateTo} onChange={(e) => setDateTo(e.target.value)} /></label>
            </>)}
            {mode === 'documentId' && (
              <label className="util-field util-field-wide"><span>Document ID</span><input type="text" value={documentId} onChange={(e) => setDocumentId(e.target.value)} placeholder="DOC-12345" /></label>
            )}
            {mode === 'data' && (<>
              <label className="util-field"><span>{u.cnpj}</span><input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} /></label>
              <label className="util-field"><span>{u.serie}</span><input type="text" value={serie} onChange={(e) => setSerie(e.target.value)} /></label>
              <label className="util-field"><span>{u.numero}</span><input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} /></label>
            </>)}
            {mode === 'file' && (
              <label className="util-field util-field-wide"><span>{u.fileIds}</span><textarea rows="3" value={fileIds} onChange={(e) => setFileIds(e.target.value)} placeholder={u.fileIdsPlaceholder} /></label>
            )}
          </div>

          <div className="util-extra-fields">
            <label className="util-field"><span>{u.docType}</span>
              <select value={docType} onChange={(e) => setDocType(e.target.value)}><option value="">{u.all}</option>{getDocTypes().map((dt) => <option key={dt}>{dt}</option>)}</select>
            </label>
            <label className="util-field"><span>Owner</span><input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="COMP-001" /></label>
            <label className="util-field"><span>Owner Search Code</span><input type="text" value={ownerSearchCode} onChange={(e) => setOwnerSearchCode(e.target.value)} /></label>
            <label className="util-radio-inline"><input type="checkbox" checked={isHistorical} onChange={(e) => setIsHistorical(e.target.checked)} />{u.historical}</label>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>{loading ? <span className="doc-spinner" /> : u.search}</button>
        </form>
      </div>

      {results && (
        <div className="util-panel">
          <div className="util-action-bar">
            <h3>{u.results} ({results.total}) — {selected.length} {u.selected}</h3>
            <div className="util-actions">
              <div className="util-queue-input">
                <input type="text" value={queueName} onChange={(e) => setQueueName(e.target.value)} placeholder="Queue name" />
                <button className="primary-btn" onClick={() => runAction('queue', (ids) => sendToQueue(ids, queueName))} disabled={!!actionLoading}>
                  {actionLoading === 'queue' ? <span className="doc-spinner" /> : u.sendToQueue}
                </button>
              </div>
              <button className="danger-btn" onClick={() => runAction('purge', purgeDocuments)} disabled={!!actionLoading}>{u.purge}</button>
              <button className="ghost-btn" onClick={() => runAction('reprint', reprintPdf)} disabled={!!actionLoading}>{u.reprint}</button>
              <button className="ghost-btn" onClick={() => runAction('returns', downloadReturns)} disabled={!!actionLoading}>{u.downloadReturns}</button>
            </div>
          </div>

          <div className="table-wrapper">
            <table><thead><tr><th className="th-check"><input type="checkbox" checked={selected.length === results.documents.length && results.documents.length > 0} onChange={toggleAll} /></th><th>Document ID</th><th>{u.docType}</th><th>Owner</th><th>Status</th><th>{u.creationDate}</th></tr></thead>
              <tbody>
                {results.documents.map((doc) => (
                  <tr key={doc.documentId} className={selected.includes(doc.documentId) ? 'row-selected' : ''}>
                    <td className="td-check"><input type="checkbox" checked={selected.includes(doc.documentId)} onChange={() => toggleOne(doc.documentId)} /></td>
                    <td className="td-mono">{doc.documentId}</td>
                    <td><span className="badge primary">{doc.documentType}</span></td>
                    <td>{doc.owner}</td>
                    <td><span className={`badge ${doc.status === 'Authorized' ? 'success' : doc.status === 'Error' ? 'danger' : 'warning'}`}>{doc.status}</span></td>
                    <td>{fmtDate(doc.creationDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {logs.length > 0 && (
        <div className="util-panel util-log-panel">
          <h3>{u.log}</h3>
          <div className="util-log">{logs.map((l, i) => <div key={i} className="util-log-line"><span className="util-log-time">{l.time}</span>{l.msg}</div>)}</div>
        </div>
      )}
    </div>
  )
}

export default UtilitySearchPage
