import { useState, useCallback } from 'react'
import { useI18n } from '../../i18n/useI18n'
import {
  getProcessDocumentTypes, getReportsByDocumentType, getDynamicFilters,
  getReportRequests, saveReportRequest,
} from '../../services/processService'
import FilterField from '../documents/components/FilterField'
import './ProcessesPage.css'

function ProcessesPage() {
  const { t } = useI18n()
  const p = t.proc

  const [docTypes] = useState(() => getProcessDocumentTypes())
  const [documentType, setDocumentType] = useState('')
  const [reports, setReports] = useState([])
  const [reportName, setReportName] = useState('')
  const [sendEmail, setSendEmail] = useState('')
  const [dynamicFilters, setDynamicFilters] = useState([])
  const [tagValues, setTagValues] = useState({})
  const [requests, setRequests] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)


  const showAlert = useCallback((type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000) }, [])

  const handleDocTypeChange = useCallback((value) => {
    setDocumentType(value)
    setReportName('')
    setTagValues({})
    setShowForm(false)
    if (!value) { setReports([]); setDynamicFilters([]); setRequests([]); return }

    getReportsByDocumentType(value).then((reps) => {
      setReports(reps)
      setShowForm(reps.length > 0)
    })
    getDynamicFilters(value).then(setDynamicFilters)
    getReportRequests(value).then(setRequests)
  }, [])

  const handleTagChange = useCallback((tag, value) => {
    setTagValues((prev) => ({ ...prev, [tag]: value }))
  }, [])

  const handleRefresh = useCallback(() => {
    if (documentType) getReportRequests(documentType).then(setRequests)
  }, [documentType])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!reportName) { showAlert('warning', p.selectReport); return }

    const reportDesc = reports.find((r) => r.value === reportName)?.text || reportName
    setSaving(true)
    saveReportRequest(
      { documentType, reportName, reportDescription: reportDesc, sendEmail },
      Object.entries(tagValues).filter(([, v]) => v).map(([k, v]) => ({ name: k, value: v }))
    ).then(() => {
      showAlert('success', p.requestCreated)
      handleRefresh()
    }).finally(() => setSaving(false))
  }, [reportName, documentType, sendEmail, tagValues, reports, showAlert, p, handleRefresh])

  const fmtDate = (d) => d ? new Date(d).toLocaleString() : '—'

  return (
    <div className="proc-page">
      {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.msg}</span></div>}

      {/* Section 1: Document Type Filter */}
      <div className="proc-panel">
        <h3>{p.filterTitle}</h3>
        <div className="proc-doctype-row">
          <label className="proc-field">
            <span>{p.documentType}</span>
            <select value={documentType} onChange={(e) => handleDocTypeChange(e.target.value)}>
              <option value="">{p.selectDocType}</option>
              {docTypes.map((dt) => (
                <option key={dt.id} value={dt.id}>[{dt.country}] {t.docTypes?.[dt.labelKey] || dt.labelKey}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Section 2: Report Request Form (hidden until docType selected) */}
      {showForm && (
        <div className="proc-panel">
          <h3>{p.newRequest}</h3>
          <form className="proc-request-form" onSubmit={handleSubmit}>
            <div className="proc-form-fixed">
              <label className="proc-field">
                <span>{p.reportType} *</span>
                <select value={reportName} onChange={(e) => setReportName(e.target.value)}>
                  <option value="">{p.selectReport}</option>
                  {reports.map((r) => <option key={r.value} value={r.value}>{r.text}</option>)}
                </select>
              </label>
              <label className="proc-field">
                <span>{p.sendEmail}</span>
                <input type="email" value={sendEmail} onChange={(e) => setSendEmail(e.target.value)} placeholder={p.emailPlaceholder} />
              </label>
            </div>

            {dynamicFilters.length > 0 && (
              <div className="proc-dynamic-filters">
                <h4>{p.dynamicFilters}</h4>
                <div className="doc-dynamic-grid">
                  {dynamicFilters.map((filter) => (
                    <FilterField key={filter.tag} filter={filter} value={tagValues[filter.tag]} onChange={handleTagChange} t={t} />
                  ))}
                </div>
              </div>
            )}

            <div className="proc-form-actions">
              <button type="submit" className="primary-btn" disabled={saving || !reportName}>
                {saving ? <span className="doc-spinner" /> : p.addRequest}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Section 3: Requests Grid */}
      {documentType && (
        <div className="proc-panel">
          <div className="proc-grid-header">
            <h3>{p.requests}</h3>
            <button className="ghost-btn" onClick={handleRefresh}>↻ {p.refresh}</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{p.description}</th>
                  <th>{p.requestedDate}</th>
                  <th>{p.startDate}</th>
                  <th>{p.endDate}</th>
                  <th>{p.download}</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 && (
                  <tr><td colSpan="5" className="empty-row">{p.noRequests}</td></tr>
                )}
                {requests.map((req) => (
                  <tr key={req.requestId} className={req.status === 0 ? 'proc-row-processing' : ''}>
                    <td className="td-name">{req.reportDescription}</td>
                    <td>{fmtDate(req.requestedDate)}</td>
                    <td>{fmtDate(req.startDate)}</td>
                    <td>{req.endDate ? fmtDate(req.endDate) : <span className="proc-processing">{p.processing}</span>}</td>
                    <td className="proc-td-download">
                      {req.endDate && req.reportFile ? (
                        <a href={`#download/${req.requestId}/${req.reportFile}`} className="proc-download-link" title={p.download}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          {req.reportFile}
                        </a>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProcessesPage
