const SEARCH_MODES = [
  { value: 'period', labelKey: 'searchByPeriod' },
  { value: 'documentId', labelKey: 'searchByDocumentId' },
  { value: 'data', labelKey: 'searchByData' },
  { value: 'file', labelKey: 'searchByFile' },
]

const DOC_TYPES = ['NFe', 'CTe', 'MDFe', 'NFSe', 'CFDI', 'DTE', 'AFIP']

const MOCK_RESULTS = (count) => Array.from({ length: count }, () => ({
  documentId: `DOC-${50000 + Math.floor(Math.random() * 50000)}`,
  documentType: DOC_TYPES[Math.floor(Math.random() * DOC_TYPES.length)],
  owner: `COMP-00${Math.floor(Math.random() * 5) + 1}`,
  ownerSearchCode: `${Math.floor(Math.random() * 90000000000000) + 10000000000000}`,
  status: ['Processing', 'Authorized', 'Error', 'Cancelled'][Math.floor(Math.random() * 4)],
  creationDate: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
}))

export function getSearchModes() { return SEARCH_MODES }
export function getDocTypes() { return DOC_TYPES }

export async function searchDocuments(_filters) {
  await new Promise((r) => setTimeout(r, 600))
  const count = Math.floor(Math.random() * 20) + 5
  return { total: count, documents: MOCK_RESULTS(count) }
}

export async function sendToQueue(documentIds, queueName, _changeQueueName) {
  await new Promise((r) => setTimeout(r, 800))
  return { success: true, processed: documentIds.length, message: `${documentIds.length} documents sent to queue "${queueName}"` }
}

export async function purgeDocuments(documentIds) {
  await new Promise((r) => setTimeout(r, 1000))
  return { success: true, deleted: documentIds.length, message: `${documentIds.length} documents and all related records purged` }
}

export async function reprintPdf(documentIds) {
  await new Promise((r) => setTimeout(r, 600))
  return { success: true, message: `Reprint queued for ${documentIds.length} documents (queue: NFEPrint1)` }
}

export async function downloadReturns(documentIds) {
  await new Promise((r) => setTimeout(r, 700))
  return { success: true, message: `Return messages reprocessed for ${documentIds.length} documents` }
}

export async function exportObjectSpace(documentIds) {
  await new Promise((r) => setTimeout(r, 800))
  return { success: true, message: `ObjectSpace exported for ${documentIds.length} documents` }
}

export async function exportAttachments(documentIds, attachmentType) {
  await new Promise((r) => setTimeout(r, 900))
  return { success: true, message: `Attachments (${attachmentType}) exported for ${documentIds.length} documents` }
}

export async function backupExport(documentIds) {
  await new Promise((r) => setTimeout(r, 1200))
  return { success: true, message: `Backup exported for ${documentIds.length} documents to BackupExport/` }
}

export async function exportTabbedIndex(_documentIds) {
  await new Promise((r) => setTimeout(r, 700))
  return { success: true, message: `Tabbed index generated: Index_Tabbed_${Date.now()}.txt` }
}

export async function changeEmissionType(documentIds, tpEmis, _justification) {
  await new Promise((r) => setTimeout(r, 800))
  return { success: true, message: `Emission type changed to ${tpEmis} for ${documentIds.length} NFe documents. Signature removed, sent to TFClientSign1.` }
}

export async function fixTimbreCfdi(documentIds) {
  await new Promise((r) => setTimeout(r, 700))
  return { success: true, message: `TimbreFiscalDigital fixed for ${documentIds.length} CFDI documents. Sent to CFDIPrint1.` }
}

export async function importUuidXmls(_directory) {
  await new Promise((r) => setTimeout(r, 1000))
  return { success: true, imported: 15, message: '15 UUID XMLs imported from directory' }
}

export async function cfdiApprovalMessage(documentIds) {
  await new Promise((r) => setTimeout(r, 500))
  return { success: true, message: `Approval messages generated for ${documentIds.length} CFDI documents` }
}

export async function fixEnvioDte(documentIds) {
  await new Promise((r) => setTimeout(r, 800))
  return { success: true, message: `EnvioDTE envelope rebuilt and signed for ${documentIds.length} DTE documents` }
}

export async function processChepIndex(documentIds) {
  await new Promise((r) => setTimeout(r, 900))
  return { success: true, message: `CHEP Index generated for ${documentIds.length} documents` }
}

export async function extractObjectSpaceFromQueue(queueName, _count) {
  await new Promise((r) => setTimeout(r, 600))
  return { success: true, extracted: 10, message: `10 ObjectSpaces extracted from queue "${queueName}"` }
}

export async function clearQueue(queueName) {
  await new Promise((r) => setTimeout(r, 400))
  return { success: true, message: `Queue "${queueName}" cleared` }
}
