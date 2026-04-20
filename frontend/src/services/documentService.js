import { getDocumentTypeOptions, getActionsForType, getFiltersForType } from '../config/documentTypes'

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

  const count = Math.floor(Math.random() * 20) + 1
  return Array.from({ length: count }, (_, i) => ({
    id: 1000 + i,
    documentType: filters.documentType,
    process: filters.process === '0' ? 'Outbound' : 'Inbound',
    situation: ['Processing', 'Finished with Success', 'Finished with Error'][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    tags: Object.fromEntries(
      Object.entries(filters.dynamicFilters || {}).filter(([, v]) => v).map(([k, v]) => [k, v])
    ),
  }))
}
