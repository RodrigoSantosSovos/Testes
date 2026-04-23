export async function fetchDashboardData() {
  await new Promise((r) => setTimeout(r, 300))

  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })

  return {
    kpis: {
      totalProcessed: 12847,
      totalProcessedDelta: '+8.3%',
      totalErrors: 342,
      totalErrorsDelta: '-12.1%',
      successRate: 97.3,
      successRateDelta: '+0.4%',
      avgProcessingTime: 2.4,
      avgProcessingTimeDelta: '-0.3s',
    },

    documentsPerDay: days.map((date, i) => ({
      date,
      success: [1680, 1920, 1750, 2100, 1890, 1540, 1967][i],
      error: [52, 38, 67, 45, 55, 42, 43][i],
    })),

    errorsByDocType: [
      { docType: 'BR - NF-e', count: 128, percentage: 37 },
      { docType: 'BR - CT-e', count: 67, percentage: 20 },
      { docType: 'AR - AFIP Local', count: 54, percentage: 16 },
      { docType: 'CL - DTE', count: 41, percentage: 12 },
      { docType: 'BR - NFS-e', count: 29, percentage: 8 },
      { docType: 'CR - Factura', count: 23, percentage: 7 },
    ],

    errorsByCompany: [
      { companyId: 'COMP-001', companyName: 'Sovos Brasil LTDA', total: 89, nfe: 52, cte: 21, other: 16 },
      { companyId: 'COMP-002', companyName: 'Sovos Argentina S.A.', total: 54, nfe: 0, cte: 0, other: 54 },
      { companyId: 'COMP-004', companyName: 'Empresa Teste Nacional', total: 78, nfe: 48, cte: 18, other: 12 },
      { companyId: 'COMP-005', companyName: 'Distribuidora Central', total: 45, nfe: 28, cte: 10, other: 7 },
      { companyId: 'COMP-003', companyName: 'Sovos Chile SpA', total: 41, nfe: 0, cte: 0, other: 41 },
    ],

    topDocumentTypes: [
      { docType: 'BR - NF-e', processed: 7842, success: 7714, error: 128, rate: 98.4 },
      { docType: 'BR - CT-e', processed: 2156, success: 2089, error: 67, rate: 96.9 },
      { docType: 'AR - AFIP Local', processed: 1203, success: 1149, error: 54, rate: 95.5 },
      { docType: 'CL - DTE', processed: 890, success: 849, error: 41, rate: 95.4 },
      { docType: 'BR - NFS-e', processed: 456, success: 427, error: 29, rate: 93.6 },
      { docType: 'CR - Factura', processed: 300, success: 277, error: 23, rate: 92.3 },
    ],

    recentErrors: [
      { id: 1, time: '3 min', company: 'Sovos Brasil', docType: 'NF-e', error: 'Schema validation failed: element infNFe', severity: 'danger' },
      { id: 2, time: '12 min', company: 'Empresa Teste', docType: 'NF-e', error: 'SEFAZ timeout after 30s', severity: 'warning' },
      { id: 3, time: '28 min', company: 'Sovos Argentina', docType: 'AFIP', error: 'CUIT inválido: checksum error', severity: 'danger' },
      { id: 4, time: '45 min', company: 'Sovos Chile', docType: 'DTE', error: 'Certificate expired', severity: 'danger' },
      { id: 5, time: '1h', company: 'Distribuidora Central', docType: 'CT-e', error: 'Duplicate document key', severity: 'warning' },
      { id: 6, time: '2h', company: 'Sovos Brasil', docType: 'NFS-e', error: 'Municipal service unavailable', severity: 'warning' },
    ],

    processingByStatus: [
      { status: 'success', label: 'Authorized', count: 12505, percentage: 97.3 },
      { status: 'error', label: 'Error', count: 342, percentage: 2.7 },
    ],
  }
}
