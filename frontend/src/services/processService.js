import { getDocumentTypeOptions, getFiltersForType } from '../config/documentTypes'

const REPORTS_BY_DOC_TYPE = {
  'BR-nfeProc': [
    { value: 'Report::NFEBR::GenerateXMLLot', text: 'Gerar Lote de XML Emitidos (ZIP)' },
    { value: 'Report::NFEBR::GenerateReceptionReport', text: 'Gerar Lote de XML Recebidos (ZIP)' },
    { value: 'Report::NFEBR::GeneratePDFLot', text: 'Gerar Lote de PDF Emitidos (ZIP)' },
  ],
  'BR-cteProc': [
    { value: 'Report::NFEBR::GenerateXMLLot', text: 'Gerar Lote de XML CT-e (ZIP)' },
    { value: 'Report::NFEBR::GeneratePDFLot', text: 'Gerar Lote de PDF CT-e (ZIP)' },
  ],
  'BR-mdfeProc': [
    { value: 'Report::NFEBR::GenerateXMLLot', text: 'Gerar Lote de XML MDF-e (ZIP)' },
  ],
  'BR-NfsePedidoCancelamento': [
    { value: 'Report::NFEBR::GenerateXMLLot', text: 'Gerar Lote de XML NFS-e (ZIP)' },
  ],
  'AR-FEV1Authorize': [
    { value: 'Report::NFEBR::GenerateXMLLot', text: 'Generar Lote de XML emitidos (ZIP)' },
    { value: 'Report::NFEBR::GeneratePDFLot', text: 'Generar Lote de PDF emitidos (ZIP)' },
  ],
  'AR-FEAuthorize': [
    { value: 'Report::NFEBR::GenerateXMLLot', text: 'Generar Lote de XML emitidos (ZIP)' },
  ],
  'CL-DTE': [
    { value: 'Report::NFEBR::GenerateXMLLot', text: 'Generar Lote de XML DTE (ZIP)' },
    { value: 'Report::NFEBR::GeneratePDFLot', text: 'Generar Lote de PDF DTE (ZIP)' },
  ],
  'CR-FacturaElectronica': [
    { value: 'Report::NFEBR::GenerateXMLLot', text: 'Generar Lote de XML Factura (ZIP)' },
  ],
}

let mockRequests = [
  { requestId: 'REQ-001', documentType: 'BR-nfeProc', username: 'admin', reportName: 'Report::NFEBR::GenerateXMLLot', reportDescription: 'Gerar Lote de XML Emitidos (ZIP)', requestedDate: '2026-04-01T14:30:00', startDate: '2026-04-01T14:30:05', endDate: '2026-04-01T14:32:10', reportFile: 'Report_REQ-001.zip', status: 2, email: 'fiscal@sovos.com' },
  { requestId: 'REQ-002', documentType: 'BR-nfeProc', username: 'admin', reportName: 'Report::NFEBR::GeneratePDFLot', reportDescription: 'Gerar Lote de PDF Emitidos (ZIP)', requestedDate: '2026-04-01T15:00:00', startDate: '2026-04-01T15:00:03', endDate: null, reportFile: null, status: 0, email: '' },
  { requestId: 'REQ-003', documentType: 'BR-nfeProc', username: 'admin', reportName: 'Report::NFEBR::GenerateReceptionReport', reportDescription: 'Gerar Lote de XML Recebidos (ZIP)', requestedDate: '2026-03-30T09:00:00', startDate: '2026-03-30T09:00:02', endDate: '2026-03-30T09:05:45', reportFile: 'Report_REQ-003.zip', status: 2, email: 'contabilidade@sovos.com' },
]

export function getProcessDocumentTypes() {
  return getDocumentTypeOptions()
}

export async function getReportsByDocumentType(documentType) {
  await new Promise((r) => setTimeout(r, 100))
  return REPORTS_BY_DOC_TYPE[documentType] || []
}

export async function getDynamicFilters(documentType) {
  await new Promise((r) => setTimeout(r, 80))
  return getFiltersForType(documentType)
}

export async function getReportRequests(documentType) {
  await new Promise((r) => setTimeout(r, 300))
  return mockRequests.filter((r) => r.documentType === documentType)
}

export async function saveReportRequest(model, _tags) {
  await new Promise((r) => setTimeout(r, 400))
  const now = new Date()
  const req = {
    requestId: `REQ-${String(Date.now()).slice(-6)}`,
    documentType: model.documentType,
    username: 'admin',
    reportName: model.reportName,
    reportDescription: model.reportDescription || model.reportName,
    requestedDate: now.toISOString(),
    startDate: now.toISOString(),
    endDate: null,
    reportFile: null,
    status: 0,
    email: model.sendEmail || '',
  }
  mockRequests = [req, ...mockRequests]

  setTimeout(() => {
    mockRequests = mockRequests.map((r) =>
      r.requestId === req.requestId
        ? { ...r, endDate: new Date(Date.now()).toISOString(), reportFile: `Report_${req.requestId}.zip`, status: 2 }
        : r
    )
  }, 8000)

  return { success: true, requestId: req.requestId }
}
