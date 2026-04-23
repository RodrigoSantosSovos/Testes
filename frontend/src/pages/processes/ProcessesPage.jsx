import { useState, useCallback } from 'react'
import { useI18n } from '../../i18n/useI18n'
import {
  searchProcessDocuments, sendToQueue, changeEmissionType, exportObjects,
  processKelloggIndex, cfdiApprovalMsg, downloadNfe, rebuildZips,
  processGrainger, processEnvioDte, exportAttachment, downloadReturns,
  purgeDocuments, nfePdfRecep, processChep, processUuid, fixTimbreCfdi,
  clearTfMessageQueue2, getDocTypes,
} from '../../services/processService'
import './ProcessesPage.css'

function ProcessesPage() {
  const { t } = useI18n()
  const p = t.proc

  const [mode, setMode] = useState('period')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [documentId, setDocumentId] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [serie, setSerie] = useState('')
  const [numero, setNumero] = useState('')
  const [fileContent, setFileContent] = useState('')
  const [docType, setDocType] = useState('ide')
  const [owner, setOwner] = useState('')
  const [ownerSearchCode, setOwnerSearchCode] = useState('')
  const [isHistorical, setIsHistorical] = useState(false)

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')
  const [alert, setAlert] = useState(null)
  const [logs, setLogs] = useState([])

  const [queueName, setQueueName] = useState('TFClientSendServer1')
  const [changeQueueName, setChangeQueueName] = useState(false)
  const [osQueueName, setOsQueueName] = useState('ClientMessage')
  const [tpEmis, setTpEmis] = useState('1')

  const showAlert = useCallback((type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000) }, [])
  const addLog = useCallback((msg) => { setLogs((prev) => [{ time: new Date().toLocaleTimeString(), msg }, ...prev].slice(0, 100)) }, [])

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    setLoading(true)
    searchProcessDocuments({ mode, dateFrom, dateTo, documentId, cnpj, serie, numero, fileContent, docType, owner, ownerSearchCode, isHistorical })
      .then((res) => { setResults(res); addLog(`${p.searchDone}: ${res.total} documentos`) })
      .finally(() => setLoading(false))
  }, [mode, dateFrom, dateTo, documentId, cnpj, serie, numero, fileContent, docType, owner, ownerSearchCode, isHistorical, addLog, p])

  const runProcess = useCallback((name, fn) => {
    if (!results || !results.documents.length) { showAlert('warning', p.noDocuments); return }
    const ids = results.documents.map((d) => d.documentId)
    if (!confirm(`${p.confirmProcess} ${ids.length} ${p.documents}?`)) return
    setActionLoading(name)
    fn(ids)
      .then((res) => { showAlert('success', res.message); addLog(`[${name}] ${res.message}`) })
      .catch((err) => { showAlert('danger', err.message); addLog(`[${name}] ERROR: ${err.message}`) })
      .finally(() => setActionLoading(''))
  }, [results, showAlert, addLog, p])

  const pb = useCallback((id, label, fn, tone, icon) => (
    <button
      key={id}
      className={`proc-btn ${tone || 'ghost'}-btn`}
      onClick={() => runProcess(id, fn)}
      disabled={!!actionLoading || !results}
    >
      {actionLoading === id ? <span className="doc-spinner" /> : <span className="proc-btn-icon">{icon}</span>}
      {label}
    </button>
  ), [runProcess, actionLoading, results])

  return (
    <div className="proc-page">
      {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.msg}</span></div>}

      {/* FILTERS */}
      <div className="proc-panel">
        <h3>{p.filters}</h3>
        <form className="proc-filter-form" onSubmit={handleSearch}>
          <div className="proc-filter-top">
            <div className="proc-modes">
              <label className="proc-radio"><input type="radio" checked={!isHistorical} onChange={() => setIsHistorical(false)} />{p.dailyDb}</label>
              <label className="proc-radio"><input type="radio" checked={isHistorical} onChange={() => setIsHistorical(true)} />{p.historicalDb}</label>
            </div>
            <label className="proc-field proc-field-sm"><span>{p.docType}</span>
              <select value={docType} onChange={(e) => setDocType(e.target.value)}>{getDocTypes().map((dt) => <option key={dt}>{dt}</option>)}</select>
            </label>
          </div>

          <div className="proc-search-modes">
            <div className={`proc-mode-block ${mode === 'period' ? 'active' : ''}`}>
              <label className="proc-radio"><input type="radio" name="smode" checked={mode === 'period'} onChange={() => setMode('period')} />{p.period}</label>
              {mode === 'period' && (
                <div className="proc-mode-fields">
                  <label className="proc-field"><span>{p.dateFrom}</span><input type="datetime-local" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></label>
                  <label className="proc-field"><span>{p.dateTo}</span><input type="datetime-local" value={dateTo} onChange={(e) => setDateTo(e.target.value)} /></label>
                </div>
              )}
            </div>
            <span className="proc-or">{p.or}</span>
            <div className={`proc-mode-block ${mode === 'docId' ? 'active' : ''}`}>
              <label className="proc-radio"><input type="radio" name="smode" checked={mode === 'docId'} onChange={() => setMode('docId')} />Document ID</label>
              {mode === 'docId' && <div className="proc-mode-fields"><label className="proc-field"><input type="text" value={documentId} onChange={(e) => setDocumentId(e.target.value)} placeholder="GUID" /></label></div>}
            </div>
            <span className="proc-or">{p.or}</span>
            <div className={`proc-mode-block ${mode === 'data' ? 'active' : ''}`}>
              <label className="proc-radio"><input type="radio" name="smode" checked={mode === 'data'} onChange={() => setMode('data')} />{p.data}</label>
              {mode === 'data' && (
                <div className="proc-mode-fields">
                  <label className="proc-field"><span>CNPJ</span><input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} /></label>
                  <label className="proc-field"><span>{p.serie}</span><input type="text" value={serie} onChange={(e) => setSerie(e.target.value)} /></label>
                  <label className="proc-field"><span>{p.numero}</span><input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} /></label>
                </div>
              )}
            </div>
            <span className="proc-or">{p.or}</span>
            <div className={`proc-mode-block ${mode === 'file' ? 'active' : ''}`}>
              <label className="proc-radio"><input type="radio" name="smode" checked={mode === 'file'} onChange={() => setMode('file')} />{p.file}</label>
              {mode === 'file' && <div className="proc-mode-fields"><label className="proc-field proc-field-wide"><textarea rows="3" value={fileContent} onChange={(e) => setFileContent(e.target.value)} placeholder={p.filePlaceholder} /></label></div>}
            </div>
          </div>

          <div className="proc-filter-bottom">
            <label className="proc-field"><span>Owner</span><input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} /></label>
            <label className="proc-field"><span>Owner Search Code</span><input type="text" value={ownerSearchCode} onChange={(e) => setOwnerSearchCode(e.target.value)} /></label>
            <button type="submit" className="primary-btn" disabled={loading}>{loading ? <span className="doc-spinner" /> : p.search}</button>
          </div>

          {results && <div className="proc-result-count">{p.found}: <strong>{results.total}</strong> {p.documents}</div>}
        </form>
      </div>

      {/* PROCESSES - 2 columns */}
      <div className="proc-actions-grid">
        <div className="proc-panel proc-col">
          <h3>{p.colLeft}</h3>
          <div className="proc-group">
            <label className="proc-field proc-field-sm"><span>{p.queueLabel}</span><input type="text" value={queueName} onChange={(e) => setQueueName(e.target.value)} /></label>
            <label className="proc-check"><input type="checkbox" checked={changeQueueName} onChange={(e) => setChangeQueueName(e.target.checked)} />{p.changeQueueTo}</label>
            {changeQueueName && <label className="proc-field proc-field-sm"><input type="text" value={osQueueName} onChange={(e) => setOsQueueName(e.target.value)} /></label>}
            {pb("sendQueue", p.sendToQueue, (ids) => sendToQueue(ids, queueName, changeQueueName, osQueueName), "primary", "📤")}
          </div>
          <div className="proc-group">
            <label className="proc-field proc-field-sm"><span>tpEmis</span><input type="text" value={tpEmis} onChange={(e) => setTpEmis(e.target.value)} /></label>
            {pb("tpEmis", p.changeTpEmis, (ids) => changeEmissionType(ids, tpEmis), "primary", "🔄")}
          </div>
          {pb("exportObj", p.exportObjects, exportObjects, null, "📦")}
          {pb("kellogg", p.kelloggIndex, processKelloggIndex, null, "📋")}
          {pb("cfdiApproval", p.cfdiApproval, cfdiApprovalMsg, null, "✅")}
        </div>

        <div className="proc-panel proc-col">
          <h3>{p.colRight}</h3>
          {pb("clearQueue", p.clearQueue, () => clearTfMessageQueue2(), "danger", "🗑️")}
          {pb("downloadNfe", p.downloadNfe, downloadNfe, null, "⬇️")}
          {pb("rebuildZips", p.rebuildZips, rebuildZips, null, "🗜️")}
          {pb("grainger", p.grainger, processGrainger, null, "🏭")}
          {pb("envioDte", p.envioDte, processEnvioDte, null, "🇨🇱")}
          {pb("exportAttach", p.exportAttach, exportAttachment, null, "📎")}
          {pb("dlReturns", p.dlReturns, downloadReturns, null, "🔁")}
          {pb("purge", p.purge, purgeDocuments, "danger", "⚠️")}
          {pb("nfePdf", p.nfePdf, nfePdfRecep, null, "🖨️")}
          {pb("chep", p.chep, processChep, null, "📊")}
          {pb("uuid", p.uuid, () => processUuid(), null, "🔑")}
          {pb("fixTimbre", p.fixTimbre, fixTimbreCfdi, null, "🇲🇽")}
        </div>
      </div>

      {/* LOG */}
      {logs.length > 0 && (
        <div className="proc-panel proc-log-panel">
          <div className="proc-log-header"><h3>{p.logTitle}</h3><button className="ghost-btn" onClick={() => setLogs([])}>{p.clearLog}</button></div>
          <div className="proc-log">{logs.map((l, i) => <div key={i} className="util-log-line"><span className="util-log-time">{l.time}</span>{l.msg}</div>)}</div>
        </div>
      )}
    </div>
  )
}

export default ProcessesPage
