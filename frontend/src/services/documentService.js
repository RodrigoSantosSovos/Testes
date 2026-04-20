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

export async function fetchAttachmentContent(documentId, attachmentName) {
  await new Promise((r) => setTimeout(r, 300))
  const ext = attachmentName.split('.').pop().toLowerCase()

  if (ext === 'xml') {
    return {
      type: 'xml',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe versao="4.00" Id="NFe${documentId}">
      <ide>
        <cUF>35</cUF>
        <cNF>00000001</cNF>
        <natOp>Venda de mercadoria</natOp>
        <mod>55</mod>
        <serie>1</serie>
        <nNF>${Math.floor(Math.random() * 9000) + 1000}</nNF>
        <dhEmi>2025-03-15T10:30:00-03:00</dhEmi>
        <tpNF>1</tpNF>
        <idDest>1</idDest>
        <tpAmb>1</tpAmb>
      </ide>
      <emit>
        <CNPJ>12345678000195</CNPJ>
        <xNome>Empresa Emissora LTDA</xNome>
        <enderEmit>
          <xLgr>Rua das Flores</xLgr>
          <nro>123</nro>
          <xBairro>Centro</xBairro>
          <cMun>3550308</cMun>
          <xMun>São Paulo</xMun>
          <UF>SP</UF>
          <CEP>01001000</CEP>
        </enderEmit>
      </emit>
      <dest>
        <CNPJ>98765432000100</CNPJ>
        <xNome>Empresa Receptora S.A.</xNome>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>001</cProd>
          <xProd>Produto Teste</xProd>
          <NCM>84714100</NCM>
          <qCom>10.0000</qCom>
          <vUnCom>150.00</vUnCom>
          <vProd>1500.00</vProd>
        </prod>
      </det>
      <total>
        <ICMSTot>
          <vNF>1500.00</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
  <protNFe versao="4.00">
    <infProt>
      <tpAmb>1</tpAmb>
      <chNFe>35250312345678000195550010000${documentId}0</chNFe>
      <dhRecbto>2025-03-15T10:31:00-03:00</dhRecbto>
      <nProt>135250000000001</nProt>
      <digVal>abc123def456</digVal>
      <cStat>100</cStat>
      <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>`,
    }
  }

  if (ext === 'txt') {
    return {
      type: 'txt',
      content: `Document ID: ${documentId}
Attachment: ${attachmentName}
Generated: ${new Date().toISOString()}

Status: Autorizado
Protocol: 135250000000001
Authorization Date: 2025-03-15 10:31:00

This is a text attachment containing processing details
for the electronic document referenced above.

---
Sovos Tax Compliance Platform
`,
    }
  }

  if (ext === 'pdf') {
    return { type: 'pdf', content: null, message: 'PDF preview not available. Please download the file.' }
  }

  return {
    type: 'text',
    content: `[Binary file: ${attachmentName}]\n\nPreview not available for this file type. Please download.`,
  }
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
