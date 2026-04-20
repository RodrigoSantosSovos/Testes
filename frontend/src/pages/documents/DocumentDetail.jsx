import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { hasPermission } from '../../services/authService'
import {
  fetchDocumentDetail, fetchDocumentHistory, fetchDocumentAttachments,
  fetchDocumentErrors, fetchDocumentAudit, fetchDocumentFlags,
  fetchDocumentMessages, fetchAttachmentContent, executeAction, deleteDocument, sendToQueue,
} from '../../services/documentService'

const SEMAPHORE = ['⏳', '✅', '❌']
const SEM_CLASS = ['warning', 'success', 'danger']

function DocumentDetail({ documentId, onBack, userPermissions, actionOptions }) {
  const { t } = useI18n()
  const dt = t.detail
  const hasSupport = hasPermission(userPermissions, 'UI::Main::Document_Support')
  const hasDelete = hasPermission(userPermissions, 'UI::Main::Document_Delete')

  const [doc, setDoc] = useState(null)
  const [tab, setTab] = useState('history')
  const [history, setHistory] = useState(null)
  const [attachments, setAttachments] = useState(null)
  const [errors, setErrors] = useState(null)
  const [audit, setAudit] = useState(null)
  const [flags, setFlags] = useState(null)
  const [messages, setMessages] = useState(null)
  const [alert, setAlert] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')
  const [queueName, setQueueName] = useState('')
  const [preview, setPreview] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }, [])

  const loadAll = useCallback(() => {
    fetchDocumentDetail(documentId).then(setDoc)
    fetchDocumentHistory(documentId).then(setHistory)
    fetchDocumentAttachments(documentId).then(setAttachments)
    fetchDocumentErrors(documentId).then(setErrors)
    fetchDocumentAudit(documentId).then(setAudit)
    if (hasSupport) {
      fetchDocumentFlags(documentId).then(setFlags)
      fetchDocumentMessages(documentId).then(setMessages)
    }
  }, [documentId, hasSupport])

  useEffect(() => { loadAll() }, [loadAll])

  const handleAction = useCallback((actionName) => {
    executeAction(documentId, actionName).then((res) => {
      showAlert('success', res.message)
      loadAll()
    })
  }, [documentId, showAlert, loadAll])

  const handleDelete = useCallback(() => {
    if (!deleteReason.trim()) return
    deleteDocument(documentId, deleteReason).then((res) => {
      showAlert('success', res.message)
      setDeleteModal(false)
      setTimeout(onBack, 1500)
    })
  }, [documentId, deleteReason, showAlert, onBack])

  const handleSendToQueue = useCallback(() => {
    if (!queueName.trim()) return
    sendToQueue(documentId, queueName).then((res) => {
      showAlert('success', res.message)
      setQueueName('')
    })
  }, [documentId, queueName, showAlert])

  const handlePreview = useCallback((attachment) => {
    setPreviewLoading(true)
    setPreview({ name: attachment.name, type: null, content: null })
    fetchAttachmentContent(documentId, attachment.name)
      .then((data) => setPreview({ name: attachment.name, ...data }))
      .finally(() => setPreviewLoading(false))
  }, [documentId])

  const fmtDate = (d) => d ? new Date(d).toLocaleString() : '—'
  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); showAlert('success', dt.copied) }

  const TABS = [
    { id: 'history', label: dt.tabHistory },
    { id: 'attachments', label: dt.tabAttachments },
    { id: 'errors', label: dt.tabErrors },
    { id: 'audit', label: dt.tabAudit },
    ...(hasSupport ? [
      { id: 'support', label: dt.tabSupport },
      { id: 'flags', label: dt.tabFlags },
      { id: 'messages', label: dt.tabMessages },
    ] : []),
  ]

  if (!doc) {
    return <div className="doc-detail-loading">{dt.loading}</div>
  }

  return (
    <div className="doc-detail">
      {alert && (
        <div className={`doc-alert ${alert.type}`}><span>{alert.message}</span><button className="alert-close" onClick={() => setAlert(null)}>×</button></div>
      )}

      <div className="doc-detail-toolbar">
        <button className="ghost-btn" onClick={onBack}>← {dt.back}</button>
        <button className="ghost-btn" onClick={loadAll}>↻ {dt.refresh}</button>
        {actionOptions.length > 0 && (
          <div className="doc-action-dropdown">
            <button className="primary-btn" onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('open')}>
              {dt.actions} ▾
            </button>
            <ul className="doc-action-menu">
              {actionOptions.map((a) => (
                <li key={a.value}><button onClick={() => handleAction(a.value)}>{t.docActions?.[a.labelKey] || a.value}</button></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Data section */}
      <section className="doc-detail-data">
        <h3>{dt.documentData}</h3>
        <div className="doc-detail-grid">
          {Object.entries(doc.tags).map(([tag, val]) => (
            <div key={tag} className="doc-detail-field">
              <span className="doc-detail-label">{t.docFilters[tagToLabelKey(tag)] || tag}</span>
              <span className="doc-detail-value">{typeof val === 'string' && val.includes('T') ? fmtDate(val) : String(val)}</span>
            </div>
          ))}
          <div className="doc-detail-field">
            <span className="doc-detail-label">Status</span>
            <span className={`badge ${SEM_CLASS[doc.semaphore]}`}>{doc.statusDescription}</span>
          </div>
          <div className="doc-detail-field">
            <span className="doc-detail-label">{dt.semaphore}</span>
            <span className={`sem sem-${SEM_CLASS[doc.semaphore]}`}>{SEMAPHORE[doc.semaphore]}</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="doc-tabs">
        <div className="doc-tab-bar">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              className={`doc-tab-btn ${tab === tb.id ? 'active' : ''}`}
              onClick={() => setTab(tb.id)}
            >
              {tb.label}
            </button>
          ))}
        </div>

        <div className="doc-tab-content">
          {tab === 'history' && (
            <table><thead><tr>
              {hasSupport && <th>Flow ID</th>}
              <th>{dt.creationDate}</th><th>Status</th><th>{dt.semaphore}</th>
            </tr></thead><tbody>
              {(history || []).map((h) => (
                <tr key={h.historyId}>
                  {hasSupport && <td className="td-mono">{h.flowId}</td>}
                  <td>{fmtDate(h.creationDate)}</td>
                  <td>{h.statusDescription}</td>
                  <td><span className={`sem sem-${SEM_CLASS[h.semaphore]}`}>{SEMAPHORE[h.semaphore]}</span></td>
                </tr>
              ))}
            </tbody></table>
          )}

          {tab === 'attachments' && (
            <table><thead><tr>
              <th>{dt.creationDate}</th><th>{dt.attachmentName}</th><th></th>
            </tr></thead><tbody>
              {(attachments || []).map((a) => (
                <tr key={a.id}>
                  <td>{fmtDate(a.creationDate)}</td>
                  <td className="td-name">{a.name}</td>
                  <td className="td-attach-actions">
                    <button className="attach-btn attach-view" onClick={() => handlePreview(a)} title={dt.view}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                      {dt.view}
                    </button>
                    <a href={a.downloadUrl} className="attach-btn attach-download" title={dt.download}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {dt.download}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody></table>
          )}

          {tab === 'errors' && (
            <table><thead><tr>
              <th>{dt.creationDate}</th><th>{dt.method}</th><th>{dt.message}</th>
            </tr></thead><tbody>
              {(errors || []).map((e) => (
                <tr key={e.id}>
                  <td>{fmtDate(e.creationDate)}</td>
                  <td className="td-mono">{e.method}</td>
                  <td>{e.message}</td>
                </tr>
              ))}
            </tbody></table>
          )}

          {tab === 'audit' && (
            <table><thead><tr>
              <th>{dt.creationDate}</th><th>{dt.username}</th><th>{dt.actionDesc}</th>
            </tr></thead><tbody>
              {(audit || []).map((a) => (
                <tr key={a.id}>
                  <td>{fmtDate(a.creationDate)}</td>
                  <td>{a.username}</td>
                  <td>{a.actionDescription}</td>
                </tr>
              ))}
            </tbody></table>
          )}

          {tab === 'support' && hasSupport && (
            <div className="doc-support">
              <div className="doc-support-section">
                <h4>{dt.documentInfo}</h4>
                <div className="doc-detail-grid">
                  <FieldCopy label="Document ID" value={String(doc.id)} onCopy={copyToClipboard} />
                  <FieldCopy label="Document Type" value={doc.documentType} onCopy={copyToClipboard} />
                  <div className="doc-detail-field"><span className="doc-detail-label">Process</span><span className="doc-detail-value">{doc.process}</span></div>
                  <div className="doc-detail-field"><span className="doc-detail-label">{dt.creationDate}</span><span className="doc-detail-value">{fmtDate(doc.createdAt)}</span></div>
                  <div className="doc-detail-field"><span className="doc-detail-label">{dt.creationDateUTC}</span><span className="doc-detail-value">{fmtDate(doc.createdAtUTC)}</span></div>
                  <div className="doc-detail-field"><span className="doc-detail-label">Store Path</span><span className="doc-detail-value td-mono">{doc.storePath}</span></div>
                  <div className="doc-detail-field"><span className="doc-detail-label">Database</span><span className="doc-detail-value">{doc.useDatabase}</span></div>
                </div>
              </div>
              <div className="doc-support-section">
                <h4>Owner</h4>
                <div className="doc-detail-grid">
                  <FieldCopy label="Company ID" value={doc.owner.companyId} onCopy={copyToClipboard} />
                  <FieldCopy label="Search Code" value={doc.owner.searchCode} onCopy={copyToClipboard} />
                </div>
              </div>
              <div className="doc-support-section">
                <h4>Receiver</h4>
                <div className="doc-detail-grid">
                  <FieldCopy label="Company ID" value={doc.receiver.companyId} onCopy={copyToClipboard} />
                  <FieldCopy label="Search Code" value={doc.receiver.searchCode} onCopy={copyToClipboard} />
                </div>
              </div>
              <div className="doc-support-section">
                <h4>{dt.supportActions}</h4>
                <div className="doc-support-actions">
                  <div className="doc-queue-row">
                    <input type="text" value={queueName} onChange={(e) => setQueueName(e.target.value)} placeholder={dt.queueNamePlaceholder} />
                    <button className="primary-btn" onClick={handleSendToQueue} disabled={!queueName.trim()}>{dt.sendToQueue}</button>
                  </div>
                  <button className="ghost-btn" onClick={() => showAlert('success', dt.exportObjectSpace)}>{dt.exportObjectSpace}</button>
                  {hasDelete && (
                    <button className="danger-btn" onClick={() => setDeleteModal(true)}>{dt.deleteDocument}</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'flags' && hasSupport && (
            <table><thead><tr><th>{dt.flagName}</th><th>{dt.flagValue}</th></tr></thead><tbody>
              {(flags || []).map((f) => (
                <tr key={f.flagName}><td className="td-name">{f.flagName}</td><td>{f.flagValue}</td></tr>
              ))}
            </tbody></table>
          )}

          {tab === 'messages' && hasSupport && (
            <div className="table-wrapper">
              <table><thead><tr>
                <th>{dt.creationDate}</th><th>Type</th><th>Code</th><th>{dt.description}</th><th>Sent</th><th>Error</th><th>Process</th>
              </tr></thead><tbody>
                {(messages || []).map((m) => (
                  <tr key={m.id}>
                    <td>{fmtDate(m.creationDate)}</td>
                    <td>{m.messageType}</td>
                    <td className="td-mono">{m.code}</td>
                    <td>{m.description}</td>
                    <td><span className={`badge ${m.sent ? 'success' : 'danger'}`}>{m.sent ? '✓' : '✗'}</span></td>
                    <td><span className={`badge ${m.error ? 'danger' : 'success'}`}>{m.error ? '✗' : '✓'}</span></td>
                    <td>{m.processType}</td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          )}
        </div>
      </div>

      {preview && (
        <div className="modal-backdrop preview-backdrop" onClick={() => setPreview(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <div className="preview-title">
                <span className="preview-file-icon">
                  {preview.name?.endsWith('.xml') ? '📄' : preview.name?.endsWith('.pdf') ? '📕' : '📝'}
                </span>
                <h3>{preview.name}</h3>
              </div>
              <button className="preview-close" onClick={() => setPreview(null)}>✕</button>
            </div>
            <div className="preview-body">
              {previewLoading && <div className="preview-loading">{dt.loading}</div>}
              {!previewLoading && preview.type === 'xml' && (
                <pre className="preview-code preview-xml">{highlightXml(preview.content)}</pre>
              )}
              {!previewLoading && (preview.type === 'txt' || preview.type === 'text') && (
                <pre className="preview-code preview-txt">{preview.content}</pre>
              )}
              {!previewLoading && preview.type === 'pdf' && (
                <div className="preview-unsupported">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="2"/></svg>
                  <p>{preview.message}</p>
                  <a href={`#download/${preview.name}`} className="primary-btn">{dt.download}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="modal-backdrop" onClick={() => setDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{dt.confirmDelete}</h3>
            <p>{dt.confirmDeleteMsg}</p>
            <label className="doc-field" style={{ marginBottom: 16 }}>
              <span className="doc-field-label">{dt.justification} *</span>
              <textarea rows="3" value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder={dt.justificationPlaceholder} />
            </label>
            <div className="modal-actions">
              <button className="ghost-btn" onClick={() => setDeleteModal(false)}>{dt.cancel}</button>
              <button className="danger-btn" onClick={handleDelete} disabled={!deleteReason.trim()}>{dt.deleteDocument}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FieldCopy({ label, value, onCopy }) {
  return (
    <div className="doc-detail-field doc-field-copy">
      <span className="doc-detail-label">{label}</span>
      <span className="doc-detail-value td-mono">{value}</span>
      <button className="doc-copy-btn" onClick={() => onCopy(value)} title="Copy">📋</button>
    </div>
  )
}

function highlightXml(xml) {
  if (!xml) return ''
  return xml
}

function tagToLabelKey(tag) {
  const map = {
    TagVarchar1: 'cnpjEmissor', TagVarchar2: 'cnpjReceptor', TagVarchar3: 'chaveAcesso',
    TagInt1: 'serie', TagInt2: 'numeroDocumento', TagDate1: 'dataEmissao',
  }
  return map[tag] || tag
}

export default DocumentDetail
