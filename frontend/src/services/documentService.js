import { getDocumentTypeOptions, getActionsForType, getFiltersForType, documentTypes } from '../config/documentTypes'

export async function fetchDocumentTypes() {
  await new Promise((r) => setTimeout(r, 100))
  return getDocumentTypeOptions()
}

export async function fetchActions(documentTypeId, process) {
  await new Promise((r) => setTimeout(r, 50))
  return getActionsForType(documentTypeId, process)
}

export async function fetchDynamicFilters(documentTypeId) {
  await new Promise((r) => setTimeout(r, 80))
  return getFiltersForType(documentTypeId)
}

export async function searchDocuments(filters) {
  await new Promise((r) => setTimeout(r, 600))
  const cfg = documentTypes[filters.documentType]
  const cols = cfg ? cfg.filters.filter((f) => f.type === 'string' || f.type === 'integer').slice(0, 5) : []
  const count = Math.floor(Math.random() * 25) + 5
  return {
    totalRecords: count + Math.floor(Math.random() * 100),
    columns: cols.map((c) => ({ tag: c.tag, labelKey: c.labelKey })),
    rows: Array.from({ length: count }, (_, i) => {
      const statusIdx = Math.floor(Math.random() * 3)
      const row = {
        id: 10000 + Math.floor(Math.random() * 90000),
        statusDescription: ['Processing', 'Finished with Success', 'Finished with Error'][statusIdx],
        semaphore: statusIdx,
        createdAt: new Date(Date.now() - Math.random() * 60 * 86400000).toISOString(),
      }
      cols.forEach((c, ci) => {
        if (c.type === 'string') row[c.tag] = `VAL-${1000 + i}-${ci}`
        else row[c.tag] = Math.floor(Math.random() * 9000) + 1000
      })
      return row
    }),
  }
}

export async function fetchDocumentDetail(documentId) {
  await new Promise((r) => setTimeout(r, 300))
  const statusIdx = Math.floor(Math.random() * 3)
  return {
    id: documentId,
    documentType: 'BR-nfeProc',
    process: Math.random() > 0.5 ? 'Outbound' : 'Inbound',
    statusDescription: ['Processing', 'Finished with Success', 'Finished with Error'][statusIdx],
    semaphore: statusIdx,
    createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    createdAtUTC: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    storePath: `/store/documents/${documentId}/data.xml`,
    useDatabase: 'Current',
    owner: { companyId: 'COMP-001', searchCode: '12345678000195' },
    receiver: { companyId: 'COMP-002', searchCode: '98765432000100' },
    tags: {
      TagVarchar1: '12345678000195',
      TagVarchar2: '98765432000100',
      TagVarchar3: `35240${documentId}`,
      TagInt1: 1,
      TagInt2: Math.floor(Math.random() * 9000) + 1000,
      TagDate1: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    },
  }
}

export async function fetchDocumentHistory(documentId) {
  await new Promise((r) => setTimeout(r, 200))
  return Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, i) => {
    const statusIdx = i === 0 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 3)
    return {
      historyId: 5000 + i,
      flowId: `FLOW-${documentId}-${100 + i}`,
      creationDate: new Date(Date.now() - i * 3600000 - Math.random() * 3600000).toISOString(),
      statusDescription: ['Processing', 'Authorized', 'Rejected', 'Sent to SEFAZ', 'Received'][Math.floor(Math.random() * 5)],
      semaphore: statusIdx,
      processName: ['SendToSEFAZ', 'ValidateXML', 'StoreDocument', 'GeneratePDF'][Math.floor(Math.random() * 4)],
    }
  }).sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
}

export async function fetchDocumentAttachments(documentId) {
  await new Promise((r) => setTimeout(r, 150))
  const names = ['NFe_XML_Original.xml', 'DANFE.pdf', 'Protocolo_Autorizacao.xml', 'Evento_Cancelamento.xml', 'CC-e.pdf']
  return names.slice(0, Math.floor(Math.random() * 4) + 2).map((name, i) => ({
    id: 200 + i,
    name,
    type: name.endsWith('.pdf') ? 'Data' : 'Attachment',
    creationDate: new Date(Date.now() - i * 7200000).toISOString(),
    downloadUrl: `#download/${documentId}/${name}`,
  }))
}

export async function fetchDocumentErrors(_documentId) {
  await new Promise((r) => setTimeout(r, 150))
  const errors = [
    { method: 'ValidateSchema', message: 'Schema validation failed: element "infNFe" not found' },
    { method: 'SendToSEFAZ', message: 'Connection timeout after 30s' },
    { method: 'ProcessResponse', message: 'Unexpected status code 500 from SEFAZ' },
  ]
  return errors.slice(0, Math.floor(Math.random() * 3) + 1).map((e, i) => ({
    id: 300 + i,
    creationDate: new Date(Date.now() - i * 1800000).toISOString(),
    method: e.method,
    message: e.message,
  }))
}

export async function fetchDocumentAudit(_documentId) {
  await new Promise((r) => setTimeout(r, 150))
  const actions = [
    { username: 'admin', action: 'Document Created' },
    { username: 'admin', action: 'Sent to Authorization' },
    { username: 'system', action: 'Status Updated: Authorized' },
    { username: 'admin', action: 'PDF Generated' },
    { username: 'rodrigo.santos', action: 'Document Exported' },
  ]
  return actions.slice(0, Math.floor(Math.random() * 4) + 2).map((a, i) => ({
    id: 400 + i,
    creationDate: new Date(Date.now() - i * 3600000).toISOString(),
    username: a.username,
    actionDescription: a.action,
  }))
}

export async function fetchDocumentFlags(_documentId) {
  await new Promise((r) => setTimeout(r, 100))
  return [
    { flagName: 'IsAuthorized', flagValue: 'true' },
    { flagName: 'HasPDF', flagValue: 'true' },
    { flagName: 'IsCancelled', flagValue: 'false' },
    { flagName: 'RetryCount', flagValue: '0' },
    { flagName: 'Priority', flagValue: 'Normal' },
  ]
}

export async function fetchDocumentMessages(_documentId) {
  await new Promise((r) => setTimeout(r, 150))
  return [
    { id: 600, creationDate: new Date(Date.now() - 3600000).toISOString(), messageType: 'Response', code: '100', description: 'Autorizado o uso da NF-e', customReturn: '', sent: true, error: false, processType: 'Authorization', tagVarchar1: '135', tagVarchar2: String(_documentId), tagVarchar3: '' },
    { id: 601, creationDate: new Date(Date.now() - 7200000).toISOString(), messageType: 'Request', code: '0', description: 'Lote enviado com sucesso', customReturn: '', sent: true, error: false, processType: 'SendBatch', tagVarchar1: '104', tagVarchar2: '', tagVarchar3: '' },
  ]
}

export async function executeAction(documentId, actionName, _formData) {
  await new Promise((r) => setTimeout(r, 500))
  return { success: true, message: `Action "${actionName}" executed on document ${documentId}` }
}

export async function executeBatchAction(documentIds, actionName) {
  await new Promise((r) => setTimeout(r, 800))
  return { success: true, message: `Action "${actionName}" executed on ${documentIds.length} documents` }
}

export async function deleteDocument(documentId, justification) {
  await new Promise((r) => setTimeout(r, 500))
  return { success: true, message: `Document ${documentId} deleted. Reason: ${justification}` }
}

export async function sendToQueue(documentId, queueName) {
  await new Promise((r) => setTimeout(r, 400))
  return { success: true, message: `Document ${documentId} sent to queue "${queueName}"` }
}

export async function exportDocuments(_filters) {
  await new Promise((r) => setTimeout(r, 1000))
  return { success: true, message: 'Export generated (mock)' }
}
