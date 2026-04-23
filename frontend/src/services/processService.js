const DOC_TYPES = ['ide', 'NFe', 'CTe', 'MDFe', 'NFSe', 'CFDI', 'DTE', 'AFIP']

const MOCK_DOCS = (n) => Array.from({ length: n }, () => ({
  documentId: `DOC-${50000 + Math.floor(Math.random() * 50000)}`,
  documentType: DOC_TYPES[Math.floor(Math.random() * DOC_TYPES.length)],
  owner: `COMP-00${Math.floor(Math.random() * 5) + 1}`,
  status: ['Processing', 'Authorized', 'Error'][Math.floor(Math.random() * 3)],
  creationDate: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
}))

export function getDocTypes() { return DOC_TYPES }

export async function searchProcessDocuments(_filter) {
  await new Promise((r) => setTimeout(r, 500))
  const n = Math.floor(Math.random() * 20) + 3
  return { total: n, documents: MOCK_DOCS(n) }
}

export async function sendToQueue(ids, queueName, changeQueue, osQueueName) {
  await new Promise((r) => setTimeout(r, 600))
  return { success: true, message: `${ids.length} documentos enviados para fila "${queueName}"${changeQueue ? ` (QueueName→${osQueueName})` : ''}` }
}

export async function changeEmissionType(ids, tpEmis) {
  await new Promise((r) => setTimeout(r, 700))
  return { success: true, message: `Tipo emissão alterado para ${tpEmis} em ${ids.length} NFe. Assinatura removida → TFClientSign1.` }
}

export async function exportObjects(ids) {
  await new Promise((r) => setTimeout(r, 600))
  return { success: true, message: `ObjectSpace exportado para ${ids.length} documentos.` }
}

export async function processKelloggIndex(ids) {
  await new Promise((r) => setTimeout(r, 800))
  return { success: true, message: `Índice tabulado gerado: Index_Tabbed_${Date.now()}.txt (${ids.length} docs)` }
}

export async function cfdiApprovalMsg(ids) {
  await new Promise((r) => setTimeout(r, 500))
  return { success: true, message: `SQL de aprovação CFDI gerado para ${ids.length} documentos.` }
}

export async function downloadNfe(ids) {
  await new Promise((r) => setTimeout(r, 900))
  return { success: true, message: `Download NFe (Ciência da Operação) executado para ${ids.length} documentos.` }
}

export async function rebuildZips(ids) {
  await new Promise((r) => setTimeout(r, 1000))
  return { success: true, message: `${ids.length} documentos serializados como ZIP e atualizados.` }
}

export async function processGrainger(ids) {
  await new Promise((r) => setTimeout(r, 800))
  return { success: true, message: `Exportação Grainger concluída para ${ids.length} CFDI.` }
}

export async function processEnvioDte(ids) {
  await new Promise((r) => setTimeout(r, 700))
  return { success: true, message: `EnvioDTE reconstruído e assinado para ${ids.length} DTE.` }
}

export async function exportAttachment(ids) {
  await new Promise((r) => setTimeout(r, 500))
  return { success: true, message: `Anexos exportados para ${ids.length} documentos.` }
}

export async function downloadReturns(ids) {
  await new Promise((r) => setTimeout(r, 600))
  return { success: true, message: `Retornos reprocessados para ${ids.length} documentos. RESENDMSG=true.` }
}

export async function purgeDocuments(ids) {
  await new Promise((r) => setTimeout(r, 800))
  return { success: true, message: `${ids.length} documentos e registros relacionados apagados (Actions, Errors, HistoryFlow, Messages, Store).` }
}

export async function nfePdfRecep(ids) {
  await new Promise((r) => setTimeout(r, 500))
  return { success: true, message: `Reimpressão PDF (REPDF=true, PRINTRECEPCTION=true) enviada para NFEPrint1. ${ids.length} docs.` }
}

export async function processChep(ids) {
  await new Promise((r) => setTimeout(r, 700))
  return { success: true, message: `CHEP Index gerado para ${ids.length} documentos via Text_Index_ObjectMapping_CHEP.xml.` }
}

export async function processUuid() {
  await new Promise((r) => setTimeout(r, 800))
  return { success: true, message: 'XMLs UUID importados de C:\\UUIDs.' }
}

export async function fixTimbreCfdi(ids) {
  await new Promise((r) => setTimeout(r, 600))
  return { success: true, message: `TimbreFiscalDigital corrigido em ${ids.length} CFDI. Enviado para CFDIPrint1.` }
}

export async function clearTfMessageQueue2() {
  await new Promise((r) => setTimeout(r, 500))
  return { success: true, message: 'TFMessageQueue2 limpa.' }
}
