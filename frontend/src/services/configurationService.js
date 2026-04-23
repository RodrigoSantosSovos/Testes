const MOCK_COMPANIES = [
  { id: 'COMP-001', name: 'Sovos Brasil LTDA' },
  { id: 'COMP-002', name: 'Sovos Argentina S.A.' },
  { id: 'COMP-003', name: 'Sovos Chile SpA' },
  { id: 'COMP-004', name: 'Empresa Teste Nacional' },
  { id: 'COMP-005', name: 'Distribuidora Central S.A.' },
]

const MOCK_DOC_TYPES_BY_COMPANY = {
  'COMP-001': [
    { key: 'BR - Nota Fiscal Eletrônica', value: 'nfeProc' },
    { key: 'BR - CT-e', value: 'cteProc' },
    { key: 'BR - NFS-e', value: 'NfsePedidoCancelamento' },
  ],
  'COMP-002': [
    { key: 'AR - AFIP Fatura Local', value: 'FEV1Authorize' },
    { key: 'AR - AFIP Export Invoice', value: 'FEXAuthorize' },
  ],
  'COMP-003': [
    { key: 'CL - DTE', value: 'DTE' },
    { key: 'CL - Libro de Compra/Venta', value: 'LibroCompraVenta' },
  ],
  'COMP-004': [
    { key: 'BR - Nota Fiscal Eletrônica', value: 'nfeProc' },
  ],
  'COMP-005': [
    { key: 'BR - Nota Fiscal Eletrônica', value: 'nfeProc' },
    { key: 'BR - MDF-e', value: 'mdfeProc' },
  ],
}

const MOCK_COMPANY_CODES = {
  'COMP-001:nfeProc': ['001', '002', '003'],
  'COMP-001:cteProc': ['001'],
  'COMP-001:NfsePedidoCancelamento': ['SP-001'],
  'COMP-002:FEV1Authorize': ['AR-001', 'AR-002'],
  'COMP-002:FEXAuthorize': ['AR-EXP-001'],
  'COMP-003:DTE': ['CL-001'],
  'COMP-003:LibroCompraVenta': ['CL-001'],
  'COMP-004:nfeProc': ['DEFAULT'],
  'COMP-005:nfeProc': ['MG-001'],
  'COMP-005:mdfeProc': ['MG-001'],
}

const CONSTANT_TEMPLATES = {
  Certificate: [
    { constantName: 'PFX_File', category: 'Certificate', constantType: 'String', constantValue: '/certs/company.pfx' },
    { constantName: 'PFX_Password', category: 'Certificate', constantType: 'EncryptedPassword', constantValue: '••••••••' },
  ],
  SAP: [
    { constantName: 'PrimaryConnector', category: 'SAP', constantType: 'String', constantValue: 'SAP' },
    { constantName: 'SAP_Client', category: 'SAP', constantType: 'String', constantValue: '100' },
    { constantName: 'SAP_CommunicationBlocked', category: 'SAP', constantType: 'Boolean', constantValue: 'false' },
    { constantName: 'SAP_GatewayHost', category: 'SAP', constantType: 'String', constantValue: 'sapgw01.company.local' },
    { constantName: 'SAP_GatewayService', category: 'SAP', constantType: 'String', constantValue: 'sapgw00' },
    { constantName: 'SAP_Password', category: 'SAP', constantType: 'EncryptedPassword', constantValue: '••••••••' },
    { constantName: 'SAP_ProgramId', category: 'SAP', constantType: 'String', constantValue: 'SOVOS_RFC' },
    { constantName: 'SAP_Router', category: 'SAP', constantType: 'String', constantValue: '' },
    { constantName: 'SAP_SystemNumber', category: 'SAP', constantType: 'String', constantValue: '00' },
    { constantName: 'SAP_User', category: 'SAP', constantType: 'String', constantValue: 'RFC_USER' },
  ],
  WebService: [
    { constantName: 'SRV_ServiceUrl', category: 'WebService', constantType: 'String', constantValue: 'https://nfe.fazenda.sp.gov.br/ws' },
    { constantName: 'SRV_ServiceUsername', category: 'WebService', constantType: 'String', constantValue: 'ws_user' },
    { constantName: 'SRV_ServicePassword', category: 'WebService', constantType: 'EncryptedPassword', constantValue: '••••••••' },
  ],
  CN_Integrator: [
    { constantName: 'CN_CompanyId', category: 'CN_Integrator', constantType: 'String', constantValue: '' },
    { constantName: 'CN_CompanySyncStatus', category: 'CN_Integrator', constantType: 'String', constantValue: '' },
    { constantName: 'CN_IntegrationEnabled', category: 'CN_Integrator', constantType: 'String', constantValue: 'false' },
    { constantName: 'CN_OrganizationId', category: 'CN_Integrator', constantType: 'String', constantValue: '' },
  ],
  NFSe: [
    { constantName: 'NFSE_LotSequence', category: 'NFSe', constantType: 'String', constantValue: '1' },
  ],
}

export async function searchCompanies(keyword) {
  await new Promise((r) => setTimeout(r, 200))
  const q = keyword.toLowerCase()
  return MOCK_COMPANIES
    .filter((c) => c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
    .map((c) => ({ value: c.id, text: `${c.id} - ${c.name}` }))
}

export async function getDocumentTypesByCompany(companyId) {
  await new Promise((r) => setTimeout(r, 100))
  return MOCK_DOC_TYPES_BY_COMPANY[companyId] || []
}

export async function getCompanyCodesByCompanyAndDocType(companyId, documentType) {
  await new Promise((r) => setTimeout(r, 100))
  const key = `${companyId}:${documentType}`
  return (MOCK_COMPANY_CODES[key] || []).map((c) => ({ key: c, value: c }))
}

export async function getConstants(companyId, documentType, companyCode) {
  await new Promise((r) => setTimeout(r, 300))

  const categories = documentType.includes('Nfse')
    ? ['Certificate', 'WebService', 'NFSe', 'CN_Integrator']
    : ['Certificate', 'SAP', 'WebService', 'CN_Integrator']

  return categories.flatMap((cat) =>
    (CONSTANT_TEMPLATES[cat] || []).map((tmpl) => ({
      ...tmpl,
      companyId,
      documentType,
      companyCode,
    }))
  )
}

export async function saveConstants(companyId, documentType, companyCode, constants) {
  await new Promise((r) => setTimeout(r, 500))
  return { success: true, message: `${constants.length} constants saved for ${companyId}/${documentType}/${companyCode}` }
}

export async function saveConstant(_constant) {
  await new Promise((r) => setTimeout(r, 200))
  return { success: true }
}
