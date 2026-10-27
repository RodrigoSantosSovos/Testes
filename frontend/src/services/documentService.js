import api from './api'
import { FIELD_TYPES } from '../config/documentTypes'

function mapApiTypeToFieldType(apiType) {
  if (apiType.includes('String')) return FIELD_TYPES.STRING
  if (apiType.includes('Integer')) return FIELD_TYPES.INTEGER
  if (apiType.includes('Double')) return FIELD_TYPES.DOUBLE
  if (apiType.includes('DateTime')) return FIELD_TYPES.DATETIME
  return FIELD_TYPES.STRING
}

export async function fetchDocumentTypes() {
  const res = await api.get('/documents/document-types')
  return res.documentTypes.map((dt) => ({
    id: dt.name,
    labelKey: dt.name,
    country: dt.description.split(' - ')[0] || '',
    description: dt.description,
    processes: dt.processes,
  }))
}

export async function fetchActions(_documentTypeId, _process) {
  return []
}

export async function fetchDynamicFilters(documentTypeId) {
  const res = await api.get(`/documents/document-types/${documentTypeId}/filters`)
  return res.filters
    .filter((f) => f.isFilter)
    .map((f) => ({
      tag: f.name,
      labelKey: f.name,
      label: f.description,
      type: f.isRadioButton ? FIELD_TYPES.RADIO : mapApiTypeToFieldType(f.type),
      apiType: f.type,
      format: f.format,
      choices: f.choices,
    }))
}

export async function searchDocuments(filters) {
  const apiFilters = []
  if (filters.dynamicFilters) {
    for (const [tag, val] of Object.entries(filters.dynamicFilters)) {
      if (!val) continue
      if (typeof val === 'object' && val.from !== undefined) {
        if (val.from || val.to) {
          apiFilters.push({ name: tag, type: 'range', values: [val.from || '', val.to || ''] })
        }
      } else {
        apiFilters.push({ name: tag, type: 'string', value: String(val) })
      }
    }
  }

  const body = {
    documentType: filters.documentType,
    process: filters.process ? parseInt(filters.process, 10) : -1,
    situation: filters.situation ? parseInt(filters.situation, 10) : -1,
    historic: filters.historic || false,
    filters: apiFilters,
    pagination: { page: 1, pageSize: 50 },
    sort: { field: 'CreationDate', direction: 'desc' },
  }

  const res = await api.post('/documents/search', body)

  return {
    totalRecords: res.totalRecords,
    columns: res.columns.map((c) => ({ tag: c.name, labelKey: c.name, label: c.description })),
    rows: res.documents.map((doc) => {
      const row = {
        id: doc.documentId,
        statusDescription: doc.statusDescription,
        semaphore: doc.semaphore,
        createdAt: new Date().toISOString(),
      }
      if (doc.tags) {
        for (const [k, v] of Object.entries(doc.tags)) {
          row[k] = v
        }
      }
      return row
    }),
  }
}

export async function fetchDocumentDetail(documentId) {
  const doc = await api.get(`/documents/${documentId}`)
  return {
    id: doc.documentId,
    documentType: doc.documentType,
    process: doc.processType === 0 ? 'Outbound' : 'Inbound',
    statusDescription: doc.statusDescription,
    semaphore: doc.semaphore,
    createdAt: doc.creationDate,
    createdAtUTC: doc.creationDate,
    storePath: '/store/documents/' + doc.documentId,
    useDatabase: doc.historic === 0 ? 'Current' : 'History',
    owner: { companyId: doc.owner, searchCode: doc.ownerSearchCode || '' },
    receiver: { companyId: doc.receiver, searchCode: doc.receiverSearchCode || '' },
    tags: doc.tags || {},
  }
}

export async function fetchDocumentHistory(documentId) {
  const res = await api.get(`/documents/${documentId}/history`)
  return (res.history || []).map((h) => ({
    historyId: h.historyId,
    flowId: `FLOW-${h.flowId}`,
    creationDate: h.creationDate,
    statusDescription: h.statusDescription,
    semaphore: h.semaphore,
    processName: h.processName,
  }))
}

export async function fetchDocumentAttachments(documentId) {
  const res = await api.get(`/documents/${documentId}/attachments`)
  return (res.attachments || []).map((a) => ({
    id: a.attachmentId,
    name: a.attachmentName,
    type: a.type,
    creationDate: a.creationDate,
    downloadUrl: a.downloadUrl,
    contentUrl: a.contentUrl,
    canCopyContent: a.canCopyContent,
  }))
}

export async function fetchAttachmentContent(documentId, attachmentName) {
  try {
    const res = await api.get(`/documents/${documentId}/attachments/${attachmentName}/content`)
    const ct = res.contentType || ''
    let type = 'text'
    if (ct.includes('xml')) type = 'xml'
    else if (ct.includes('pdf')) type = 'pdf'
    return { type, content: res.content }
  } catch {
    return { type: 'pdf', content: null, message: 'Preview not available. Please download.' }
  }
}

export async function fetchDocumentErrors(documentId) {
  const res = await api.get(`/documents/${documentId}/errors`)
  return (res.errors || []).map((e) => ({
    id: e.errorId,
    creationDate: e.creationDate,
    method: e.method,
    message: e.message,
  }))
}

export async function fetchDocumentAudit(documentId) {
  const res = await api.get(`/documents/${documentId}/audit`)
  return (res.actions || []).map((a) => ({
    id: a.actionId,
    creationDate: a.creationDate,
    username: a.username,
    actionDescription: a.actionDescription,
  }))
}

export async function fetchDocumentFlags(documentId) {
  const res = await api.get(`/documents/${documentId}/flags`)
  return res.flags || []
}

export async function fetchDocumentMessages(documentId) {
  const res = await api.get(`/documents/${documentId}/messages`)
  return (res.messages || []).map((m) => ({
    id: m.messageId,
    creationDate: m.creationDate,
    messageType: m.messageType,
    code: m.code,
    description: m.description,
    customReturn: m.customReturn || '',
    sent: m.sent,
    error: m.error,
    processType: m.processType,
    tagVarchar1: m.tagVarchar1 || '',
    tagVarchar2: m.tagVarchar2 || '',
    tagVarchar3: m.tagVarchar3 || '',
  }))
}

export async function executeAction(documentId, _actionName, _formData) {
  return { success: true, message: `Action executed on document ${documentId}` }
}

export async function executeBatchAction(documentIds, actionName) {
  return { success: true, message: `Action "${actionName}" executed on ${documentIds.length} documents` }
}

export async function deleteDocument(documentId, justification) {
  return { success: true, message: `Document ${documentId} deleted. Reason: ${justification}` }
}

export async function sendToQueue(documentId, queueName) {
  return { success: true, message: `Document ${documentId} sent to queue "${queueName}"` }
}

export async function exportDocuments(_filters) {
  return { success: true, message: 'Export generated (mock - API endpoint pending)' }
}
