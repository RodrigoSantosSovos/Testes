import { useState, useCallback } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { exportObjectSpace, exportAttachments, backupExport, exportTabbedIndex } from '../../services/utilityService'
import './UtilityPages.css'

function UtilityExportPage() {
  const { t } = useI18n()
  const u = t.util
  const [ids, setIds] = useState('')
  const [attachType, setAttachType] = useState('all')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState('')
  const [logs, setLogs] = useState([])

  const showAlert = useCallback((type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000) }, [])
  const addLog = useCallback((msg) => { setLogs((p) => [{ time: new Date().toLocaleTimeString(), msg }, ...p].slice(0, 50)) }, [])

  const getIds = useCallback(() => ids.split('\n').map((s) => s.trim()).filter(Boolean), [ids])

  const run = useCallback((name, fn) => {
    const docIds = getIds()
    if (!docIds.length) { showAlert('warning', u.noIds); return }
    setLoading(name)
    fn(docIds).then((res) => { showAlert('success', res.message); addLog(res.message) }).finally(() => setLoading(''))
  }, [getIds, showAlert, u, addLog])

  return (
    <div className="util-page">
      {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.msg}</span></div>}
      <div className="util-panel">
        <h3>{u.exportTitle}</h3>
        <label className="util-field util-field-wide"><span>{u.documentIds}</span>
          <textarea rows="5" value={ids} onChange={(e) => setIds(e.target.value)} placeholder={u.idsPlaceholder} />
        </label>
        <p className="util-hint">{getIds().length} IDs</p>
      </div>

      <div className="util-panel">
        <h3>{u.exportActions}</h3>
        <div className="util-export-grid">
          <div className="util-export-card" onClick={() => run('os', exportObjectSpace)}>
            <div className="util-export-icon">📦</div>
            <h4>{u.exportObjectSpace}</h4>
            <p>{u.exportObjectSpaceDesc}</p>
            {loading === 'os' && <span className="doc-spinner" />}
          </div>
          <div className="util-export-card" onClick={() => run('attach', (ids2) => exportAttachments(ids2, attachType))}>
            <div className="util-export-icon">📎</div>
            <h4>{u.exportAttachments}</h4>
            <p>{u.exportAttachmentsDesc}</p>
            <select value={attachType} onChange={(e) => setAttachType(e.target.value)} onClick={(e) => e.stopPropagation()}>
              <option value="all">{u.allAttachments}</option>
              <option value="xml">XML</option>
              <option value="pdf">PDF</option>
              <option value="txt">TXT</option>
            </select>
            {loading === 'attach' && <span className="doc-spinner" />}
          </div>
          <div className="util-export-card" onClick={() => run('backup', backupExport)}>
            <div className="util-export-icon">💾</div>
            <h4>{u.backupExport}</h4>
            <p>{u.backupExportDesc}</p>
            {loading === 'backup' && <span className="doc-spinner" />}
          </div>
          <div className="util-export-card" onClick={() => run('index', exportTabbedIndex)}>
            <div className="util-export-icon">📋</div>
            <h4>{u.exportIndex}</h4>
            <p>{u.exportIndexDesc}</p>
            {loading === 'index' && <span className="doc-spinner" />}
          </div>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="util-panel util-log-panel"><h3>{u.log}</h3><div className="util-log">{logs.map((l, i) => <div key={i} className="util-log-line"><span className="util-log-time">{l.time}</span>{l.msg}</div>)}</div></div>
      )}
    </div>
  )
}

export default UtilityExportPage
