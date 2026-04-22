import { useState, useCallback } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { extractObjectSpaceFromQueue, clearQueue } from '../../services/utilityService'
import './UtilityPages.css'

function UtilityQueuePage() {
  const { t } = useI18n()
  const u = t.util
  const [queueName, setQueueName] = useState('TFClientSendServer1')
  const [extractCount, setExtractCount] = useState(10)
  const [clearQueueName, setClearQueueName] = useState('TFMessageQueue2')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState('')
  const [logs, setLogs] = useState([])

  const showAlert = useCallback((type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000) }, [])
  const addLog = useCallback((msg) => { setLogs((p) => [{ time: new Date().toLocaleTimeString(), msg }, ...p].slice(0, 50)) }, [])

  const COMMON_QUEUES = ['TFClientSendServer1', 'TFClientSign1', 'NFEPrint1', 'CFDIPrint1', 'TFMessageQueue2']

  return (
    <div className="util-page">
      {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.msg}</span></div>}

      <div className="util-queue-grid">
        <div className="util-panel">
          <h3>📤 {u.extractObjectSpace}</h3>
          <p className="util-desc">{u.extractObjectSpaceDesc}</p>
          <div className="util-fields">
            <label className="util-field"><span>{u.queueName}</span>
              <select value={queueName} onChange={(e) => setQueueName(e.target.value)}>
                {COMMON_QUEUES.map((q) => <option key={q}>{q}</option>)}
              </select>
            </label>
            <label className="util-field"><span>{u.count}</span><input type="number" min="1" max="1000" value={extractCount} onChange={(e) => setExtractCount(Number(e.target.value))} /></label>
          </div>
          <button className="primary-btn" onClick={() => { setLoading('extract'); extractObjectSpaceFromQueue(queueName, extractCount).then((r) => { showAlert('success', r.message); addLog(r.message) }).finally(() => setLoading('')) }} disabled={!!loading}>
            {loading === 'extract' ? <span className="doc-spinner" /> : u.extract}
          </button>
        </div>

        <div className="util-panel">
          <h3>🗑️ {u.clearQueueTitle}</h3>
          <p className="util-desc">{u.clearQueueDesc}</p>
          <div className="util-fields">
            <label className="util-field"><span>{u.queueName}</span>
              <select value={clearQueueName} onChange={(e) => setClearQueueName(e.target.value)}>
                {COMMON_QUEUES.map((q) => <option key={q}>{q}</option>)}
              </select>
            </label>
          </div>
          <button className="danger-btn" onClick={() => { setLoading('clear'); clearQueue(clearQueueName).then((r) => { showAlert('success', r.message); addLog(r.message) }).finally(() => setLoading('')) }} disabled={!!loading}>
            {loading === 'clear' ? <span className="doc-spinner" /> : u.clearQueue}
          </button>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="util-panel util-log-panel"><h3>{u.log}</h3><div className="util-log">{logs.map((l, i) => <div key={i} className="util-log-line"><span className="util-log-time">{l.time}</span>{l.msg}</div>)}</div></div>
      )}
    </div>
  )
}

export default UtilityQueuePage
