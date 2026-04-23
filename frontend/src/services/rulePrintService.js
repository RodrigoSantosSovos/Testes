const PAPER_SOURCES = [
  { value: '1', label: 'Upper' },
  { value: '2', label: 'Lower' },
  { value: '3', label: 'Middle' },
  { value: '4', label: 'Manual' },
  { value: '5', label: 'Envelope' },
  { value: '6', label: 'EnvelopeManual' },
  { value: '7', label: 'Auto' },
]

const PROCESSES_BY_DOC_TYPE = {
  nfeProc: ['Emission', 'Reception', 'Cancellation', 'Event'],
  cteProc: ['Emission', 'Reception', 'Cancellation'],
  NfsePedidoCancelamento: ['Cancellation'],
  FEV1Authorize: ['Emission'],
  FEXAuthorize: ['Emission'],
  DTE: ['Emission', 'Reception'],
  LibroCompraVenta: ['Emission'],
  mdfeProc: ['Emission'],
}

const ALLOWED_EXTENSIONS = ['.xml', '.txt', '.zip', '.rar', '.rpt', '.ppk', '.key', '.crt', '.cer', '.pfx', '.p12', '.sp', '.xls', '.xlsx', '.xlst', '.xsd']

let mockRules = [
  { ruleName: 'NFe_Default', printerName: 'HP LaserJet 4050', process: 'Emission', paperSource: '7', copies: 2, reportLayout: 'NFe_Layout_v4.rpt', pclTemplate: '', storePdf: true, printerAgent: 'Agent-01', xpathCondition: '', fileName: 'NFe_{NumDoc}.pdf', companyId: 'COMP-001', documentType: 'nfeProc', companyCode: '001' },
  { ruleName: 'NFe_Contingencia', printerName: 'Epson LX-300', process: 'Emission', paperSource: '1', copies: 1, reportLayout: 'NFe_Contingencia.rpt', pclTemplate: 'NFe_PCL.pcl', storePdf: false, printerAgent: '', xpathCondition: '//ide/tpEmis[text()="5"]', fileName: '', companyId: 'COMP-001', documentType: 'nfeProc', companyCode: '001' },
  { ruleName: 'NFe_Cancelamento', printerName: 'PDF Printer', process: 'Cancellation', paperSource: '7', copies: 1, reportLayout: 'NFe_Cancel.rpt', pclTemplate: '', storePdf: true, printerAgent: '', xpathCondition: '', fileName: 'Cancel_{NumDoc}.pdf', companyId: 'COMP-001', documentType: 'nfeProc', companyCode: '001' },
  { ruleName: 'CTe_Default', printerName: 'HP LaserJet 4050', process: 'Emission', paperSource: '7', copies: 1, reportLayout: 'CTe_Layout.rpt', pclTemplate: '', storePdf: true, printerAgent: 'Agent-01', xpathCondition: '', fileName: '', companyId: 'COMP-001', documentType: 'cteProc', companyCode: '001' },
]

export function getPaperSources() {
  return PAPER_SOURCES
}

export function getProcessesForDocType(documentType) {
  return PROCESSES_BY_DOC_TYPE[documentType] || ['Emission']
}

export function getAllowedExtensions() {
  return ALLOWED_EXTENSIONS
}

export async function getRules(companyId, documentType, companyCode) {
  await new Promise((r) => setTimeout(r, 300))
  return mockRules.filter(
    (r) => r.companyId === companyId && r.documentType === documentType && r.companyCode === companyCode
  )
}

export async function getRule(companyId, documentType, companyCode, ruleName) {
  await new Promise((r) => setTimeout(r, 200))
  return mockRules.find(
    (r) => r.companyId === companyId && r.documentType === documentType && r.companyCode === companyCode && r.ruleName === ruleName
  ) || null
}

export async function createRule(rule, _layoutFile, _pclFile) {
  await new Promise((r) => setTimeout(r, 500))
  const exists = mockRules.some(
    (r) => r.companyId === rule.companyId && r.documentType === rule.documentType && r.companyCode === rule.companyCode && r.ruleName === rule.ruleName
  )
  if (exists) throw new Error('RULE_EXISTS')
  mockRules = [...mockRules, { ...rule }]
  return { success: true }
}

export async function updateRule(rule, _layoutFile, _pclFile) {
  await new Promise((r) => setTimeout(r, 500))
  mockRules = mockRules.map((r) =>
    r.companyId === rule.companyId && r.documentType === rule.documentType && r.companyCode === rule.companyCode && r.ruleName === rule.ruleName
      ? { ...rule }
      : r
  )
  return { success: true }
}

export async function deleteRule(companyId, documentType, companyCode, ruleName) {
  await new Promise((r) => setTimeout(r, 300))
  mockRules = mockRules.filter(
    (r) => !(r.companyId === companyId && r.documentType === documentType && r.companyCode === companyCode && r.ruleName === ruleName)
  )
  return { success: true }
}

export function validateFile(file, fieldName) {
  if (!file) return `Upload Required: ${fieldName}`
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) return `Invalid Extension: ${fieldName}`
  return null
}
