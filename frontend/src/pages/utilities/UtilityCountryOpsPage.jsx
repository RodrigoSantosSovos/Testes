import { useState, useCallback } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { changeEmissionType, fixTimbreCfdi, importUuidXmls, cfdiApprovalMessage, fixEnvioDte, processChepIndex } from '../../services/utilityService'
import './UtilityPages.css'

function UtilityCountryOpsPage() {
  const { t } = useI18n()
  const u = t.util
  const [ids, setIds] = useState('')
  const [tpEmis, setTpEmis] = useState('1')
  const [justification, setJustification] = useState('')
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
        <h3>{u.documentIds}</h3>
        <label className="util-field util-field-wide"><textarea rows="4" value={ids} onChange={(e) => setIds(e.target.value)} placeholder={u.idsPlaceholder} /></label>
        <p className="util-hint">{getIds().length} IDs</p>
      </div>

      <div className="util-country-grid">
        <div className="util-panel util-country-section">
          <h3>🇧🇷 Brasil</h3>
          <div className="util-country-ops">
            <div className="util-op-card">
              <h4>{u.changeEmissionType}</h4>
              <p>{u.changeEmissionTypeDesc}</p>
              <div className="util-op-fields">
                <select value={tpEmis} onChange={(e) => setTpEmis(e.target.value)}>
                  <option value="1">1 - Normal</option>
                  <option value="2">2 - Contingência FS-IA</option>
                  <option value="3">3 - Contingência SCAN</option>
                  <option value="5">5 - Contingência FS-DA</option>
                  <option value="6">6 - Contingência SVC-AN</option>
                  <option value="7">7 - Contingência SVC-RS</option>
                  <option value="9">9 - Contingência Off-line</option>
                </select>
                {tpEmis !== '1' && <input type="text" value={justification} onChange={(e) => setJustification(e.target.value)} placeholder={u.justification} />}
              </div>
              <button className="primary-btn" onClick={() => { const docIds = getIds(); if (!docIds.length) { showAlert('warning', u.noIds); return }; setLoading('emis'); changeEmissionType(docIds, tpEmis, justification).then((r) => { showAlert('success', r.message); addLog(r.message) }).finally(() => setLoading('')) }} disabled={!!loading}>
                {loading === 'emis' ? <span className="doc-spinner" /> : u.execute}
              </button>
            </div>
            <div className="util-op-card">
              <h4>{u.chepIndex}</h4>
              <p>{u.chepIndexDesc}</p>
              <button className="primary-btn" onClick={() => run('chep', processChepIndex)} disabled={!!loading}>{loading === 'chep' ? <span className="doc-spinner" /> : u.execute}</button>
            </div>
          </div>
        </div>

        <div className="util-panel util-country-section">
          <h3>🇲🇽 México</h3>
          <div className="util-country-ops">
            <div className="util-op-card">
              <h4>{u.fixTimbreCfdi}</h4>
              <p>{u.fixTimbreCfdiDesc}</p>
              <button className="primary-btn" onClick={() => run('timbre', fixTimbreCfdi)} disabled={!!loading}>{loading === 'timbre' ? <span className="doc-spinner" /> : u.execute}</button>
            </div>
            <div className="util-op-card">
              <h4>{u.importUuid}</h4>
              <p>{u.importUuidDesc}</p>
              <button className="primary-btn" onClick={() => { setLoading('uuid'); importUuidXmls('/UUIDs').then((r) => { showAlert('success', r.message); addLog(r.message) }).finally(() => setLoading('')) }} disabled={!!loading}>{loading === 'uuid' ? <span className="doc-spinner" /> : u.execute}</button>
            </div>
            <div className="util-op-card">
              <h4>{u.cfdiApproval}</h4>
              <p>{u.cfdiApprovalDesc}</p>
              <button className="primary-btn" onClick={() => run('approval', cfdiApprovalMessage)} disabled={!!loading}>{loading === 'approval' ? <span className="doc-spinner" /> : u.execute}</button>
            </div>
          </div>
        </div>

        <div className="util-panel util-country-section">
          <h3>🇨🇱 Chile</h3>
          <div className="util-country-ops">
            <div className="util-op-card">
              <h4>{u.fixEnvioDte}</h4>
              <p>{u.fixEnvioDteDesc}</p>
              <button className="primary-btn" onClick={() => run('dte', fixEnvioDte)} disabled={!!loading}>{loading === 'dte' ? <span className="doc-spinner" /> : u.execute}</button>
            </div>
          </div>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="util-panel util-log-panel"><h3>{u.log}</h3><div className="util-log">{logs.map((l, i) => <div key={i} className="util-log-line"><span className="util-log-time">{l.time}</span>{l.msg}</div>)}</div></div>
      )}
    </div>
  )
}

export default UtilityCountryOpsPage
