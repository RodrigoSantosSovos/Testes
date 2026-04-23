let mockCompanies = [
  { companyId: 'COMP-001', name: 'Sovos Brasil LTDA', creationDate: '2022-01-15T10:00:00', searchCode: '12345678000195', partnerName: 'Sovos Compliance', emailAddress: 'fiscal@sovos.com.br' },
  { companyId: 'COMP-002', name: 'Sovos Argentina S.A.', creationDate: '2022-03-20T14:30:00', searchCode: '20-12345678-9', partnerName: 'Sovos Compliance', emailAddress: 'fiscal@sovos.com.ar' },
  { companyId: 'COMP-003', name: 'Sovos Chile SpA', creationDate: '2023-06-10T09:00:00', searchCode: '76.123.456-7', partnerName: 'Sovos Compliance', emailAddress: '' },
  { companyId: 'COMP-004', name: 'Empresa Teste Nacional', creationDate: '2023-09-01T08:00:00', searchCode: '98765432000100', partnerName: 'SAP SE', emailAddress: 'test@empresa.com' },
  { companyId: 'COMP-005', name: 'Distribuidora Central S.A.', creationDate: '2024-01-05T11:00:00', searchCode: '55544433000122', partnerName: '', emailAddress: '' },
]

let mockCompanyCodes = [
  { companyId: 'COMP-001', documentType: 'nfeProc', documentTypeName: 'BR - NF-e', companyCode: '001' },
  { companyId: 'COMP-001', documentType: 'nfeProc', documentTypeName: 'BR - NF-e', companyCode: '002' },
  { companyId: 'COMP-001', documentType: 'cteProc', documentTypeName: 'BR - CT-e', companyCode: '001' },
  { companyId: 'COMP-002', documentType: 'FEV1Authorize', documentTypeName: 'AR - AFIP Fatura Local', companyCode: 'AR-001' },
  { companyId: 'COMP-003', documentType: 'DTE', documentTypeName: 'CL - DTE', companyCode: 'CL-001' },
]

let branchNextId = 4
let mockBranches = [
  { companyBranchId: 1, companyId: 'COMP-001', companyCode: 'SP-001', name: 'Filial São Paulo' },
  { companyBranchId: 2, companyId: 'COMP-001', companyCode: 'RJ-001', name: 'Filial Rio de Janeiro' },
  { companyBranchId: 3, companyId: 'COMP-001', companyCode: 'MG-001', name: 'Filial Minas Gerais' },
]

const DOC_TYPE_OPTIONS = [
  { key: 'BR - NF-e', value: 'nfeProc' },
  { key: 'BR - CT-e', value: 'cteProc' },
  { key: 'BR - MDF-e', value: 'mdfeProc' },
  { key: 'BR - NFS-e', value: 'NfsePedidoCancelamento' },
  { key: 'AR - AFIP Fatura Local', value: 'FEV1Authorize' },
  { key: 'AR - AFIP Export', value: 'FEXAuthorize' },
  { key: 'CL - DTE', value: 'DTE' },
  { key: 'CR - Factura', value: 'CR-FacturaElectronica' },
]

export function getDocumentTypeOptions() { return DOC_TYPE_OPTIONS }

export async function getCompanies() {
  await new Promise((r) => setTimeout(r, 200))
  return [...mockCompanies]
}

export async function getCompany(companyId) {
  await new Promise((r) => setTimeout(r, 100))
  return mockCompanies.find((c) => c.companyId === companyId) || null
}

export async function createCompany(data) {
  await new Promise((r) => setTimeout(r, 300))
  mockCompanies = [...mockCompanies, { ...data, creationDate: new Date().toISOString() }]
  return { success: true }
}

export async function updateCompany(companyId, data) {
  await new Promise((r) => setTimeout(r, 300))
  mockCompanies = mockCompanies.map((c) => c.companyId === companyId ? { ...c, ...data } : c)
  return { success: true }
}

export async function deleteCompany(companyId) {
  await new Promise((r) => setTimeout(r, 300))
  mockCompanies = mockCompanies.filter((c) => c.companyId !== companyId)
  return { success: true }
}

export async function getCompanyCodes(companyId) {
  await new Promise((r) => setTimeout(r, 150))
  return mockCompanyCodes.filter((cc) => cc.companyId === companyId)
}

export async function addCompanyCode(companyId, documentType, companyCode) {
  await new Promise((r) => setTimeout(r, 200))
  const dtOpt = DOC_TYPE_OPTIONS.find((d) => d.value === documentType)
  mockCompanyCodes = [...mockCompanyCodes, { companyId, documentType, documentTypeName: dtOpt?.key || documentType, companyCode }]
  return { success: true }
}

export async function deleteCompanyCode(companyId, documentType, companyCode) {
  await new Promise((r) => setTimeout(r, 300))
  mockCompanyCodes = mockCompanyCodes.filter((cc) => !(cc.companyId === companyId && cc.documentType === documentType && cc.companyCode === companyCode))
  return { success: true }
}

export async function getCompanyBranches(companyId) {
  await new Promise((r) => setTimeout(r, 150))
  return mockBranches.filter((b) => b.companyId === companyId)
}

export async function addCompanyBranch(companyId, companyCode, name) {
  await new Promise((r) => setTimeout(r, 200))
  mockBranches = [...mockBranches, { companyBranchId: branchNextId++, companyId, companyCode, name }]
  return { success: true }
}

export async function updateCompanyBranch(branchId, companyCode, name) {
  await new Promise((r) => setTimeout(r, 200))
  mockBranches = mockBranches.map((b) => b.companyBranchId === branchId ? { ...b, companyCode, name } : b)
  return { success: true }
}

export async function deleteCompanyBranch(branchId) {
  await new Promise((r) => setTimeout(r, 200))
  mockBranches = mockBranches.filter((b) => b.companyBranchId !== branchId)
  return { success: true }
}

export function generateCompanyId() {
  return crypto.randomUUID().toUpperCase().slice(0, 13)
}
