const FTP_PROTOCOLS = [
  { value: 'FTP', label: 'FTP' },
  { value: 'SFTP', label: 'SFTP' },
  { value: 'FTPS', label: 'FTPS' },
]

let mockRules = [
  {
    ruleName: 'Dist_NFe_Email', companyId: 'COMP-001', documentType: 'nfeProc', companyCode: '001',
    process: 'Emission', attachments: 'DANFE.pdf', fileNameToAttach: 'NFe_{NumDoc}', extensionsToAttach: '.pdf,.xml', xpathCondition: '',
    emailTo: 'fiscal@empresa.com;contabilidade@empresa.com', subject: 'NF-e Autorizada - {NumDoc}', templateFile: 'email_nfe.html',
    wsUrl: '', wsHeaderTemplate: '', wsBodyTemplate: '', wsTransformationTemplate: '', wsContentTagName: '',
    ftpHostName: '', ftpPortNumber: '', ftpProtocol: 'FTP', ftpUserName: '', ftpPassword: '', ftpPrivateKeyFile: '', ftpRemoteDirectory: '',
    as2From: '', as2To: '', as2Url: '', as2PublicKeyFile: '', as2FromPublicKeyFile: '',
  },
  {
    ruleName: 'Dist_NFe_WS', companyId: 'COMP-001', documentType: 'nfeProc', companyCode: '001',
    process: 'Emission', attachments: 'XML_Original', fileNameToAttach: 'NFe_{Chave}', extensionsToAttach: '.xml', xpathCondition: '//ide/tpEmis[text()="1"]',
    emailTo: '', subject: '', templateFile: '',
    wsUrl: 'https://api.erp.company.com/nfe/receive', wsHeaderTemplate: 'ws_header.xml', wsBodyTemplate: 'ws_body.xml', wsTransformationTemplate: 'ws_transform.xsl', wsContentTagName: 'nfeProc',
    ftpHostName: '', ftpPortNumber: '', ftpProtocol: 'FTP', ftpUserName: '', ftpPassword: '', ftpPrivateKeyFile: '', ftpRemoteDirectory: '',
    as2From: '', as2To: '', as2Url: '', as2PublicKeyFile: '', as2FromPublicKeyFile: '',
  },
  {
    ruleName: 'Dist_NFe_FTP', companyId: 'COMP-001', documentType: 'nfeProc', companyCode: '001',
    process: 'Reception', attachments: 'XML_Original', fileNameToAttach: '{Chave}', extensionsToAttach: '.xml', xpathCondition: '',
    emailTo: '', subject: '', templateFile: '',
    wsUrl: '', wsHeaderTemplate: '', wsBodyTemplate: '', wsTransformationTemplate: '', wsContentTagName: '',
    ftpHostName: 'sftp.partner.com', ftpPortNumber: '22', ftpProtocol: 'SFTP', ftpUserName: 'sovos_user', ftpPassword: '••••••••', ftpPrivateKeyFile: 'sovos_key.ppk', ftpRemoteDirectory: '/inbound/nfe/',
    as2From: '', as2To: '', as2Url: '', as2PublicKeyFile: '', as2FromPublicKeyFile: '',
  },
]

const EMPTY_RULE = {
  ruleName: '', companyId: '', documentType: '', companyCode: '',
  process: '', attachments: '', fileNameToAttach: '', extensionsToAttach: '', xpathCondition: '',
  emailTo: '', subject: '', templateFile: '',
  wsUrl: '', wsHeaderTemplate: '', wsBodyTemplate: '', wsTransformationTemplate: '', wsContentTagName: '',
  ftpHostName: '', ftpPortNumber: '', ftpProtocol: 'FTP', ftpUserName: '', ftpPassword: '', ftpPrivateKeyFile: '', ftpRemoteDirectory: '',
  as2From: '', as2To: '', as2Url: '', as2PublicKeyFile: '', as2FromPublicKeyFile: '',
}

export function getFtpProtocols() { return FTP_PROTOCOLS }
export function getEmptyRule() { return { ...EMPTY_RULE } }

export async function getDistributionRules(companyId, documentType, companyCode) {
  await new Promise((r) => setTimeout(r, 300))
  return mockRules.filter((r) => r.companyId === companyId && r.documentType === documentType && r.companyCode === companyCode)
}

export async function getDistributionRule(companyId, documentType, companyCode, ruleName) {
  await new Promise((r) => setTimeout(r, 200))
  return mockRules.find((r) => r.companyId === companyId && r.documentType === documentType && r.companyCode === companyCode && r.ruleName === ruleName) || null
}

export async function createDistributionRule(rule) {
  await new Promise((r) => setTimeout(r, 400))
  const exists = mockRules.some((r) => r.companyId === rule.companyId && r.documentType === rule.documentType && r.companyCode === rule.companyCode && r.ruleName === rule.ruleName)
  if (exists) throw new Error('RULE_EXISTS')
  mockRules = [...mockRules, { ...EMPTY_RULE, ...rule }]
  return { success: true }
}

export async function updateDistributionRule(rule, _tabName) {
  await new Promise((r) => setTimeout(r, 400))
  mockRules = mockRules.map((r) =>
    r.companyId === rule.companyId && r.documentType === rule.documentType && r.companyCode === rule.companyCode && r.ruleName === rule.ruleName
      ? { ...r, ...rule }
      : r
  )
  return { success: true }
}

export async function deleteDistributionRule(companyId, documentType, companyCode, ruleName) {
  await new Promise((r) => setTimeout(r, 300))
  mockRules = mockRules.filter((r) => !(r.companyId === companyId && r.documentType === documentType && r.companyCode === companyCode && r.ruleName === ruleName))
  return { success: true }
}
