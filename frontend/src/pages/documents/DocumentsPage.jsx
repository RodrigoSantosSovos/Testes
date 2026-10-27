import { useState, useEffect, useCallback, useRef } from 'react'
import { useI18n } from '../../i18n/useI18n'
import {
  fetchDocumentTypes, fetchActions, fetchDynamicFilters,
  searchDocuments, executeBatchAction, exportDocuments,
} from '../../services/documentService'
import FixedFilters from './components/FixedFilters'
import DynamicFilters from './components/DynamicFilters'
import ResultsTable from './components/ResultsTable'
import DocumentDetail from './DocumentDetail'
import './DocumentsPage.css'

const INITIAL_FIXED = {
  documentType: '',
  process: '',
  action: '',
  situation: '-1',
  historic: false,
}

function DocumentsPage({ userPermissions }) {
  const { t } = useI18n()

  const [docTypeOptions, setDocTypeOptions] = useState([])
  const [actionOptions, setActionOptions] = useState([])
  const [dynamicFilterDefs, setDynamicFilterDefs] = useState([])
  const [fixed, setFixed] = useState(INITIAL_FIXED)
  const [dynamic, setDynamic] = useState({})
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filtersCollapsed, setFiltersCollapsed] = useState(false)
  const [detailDocId, setDetailDocId] = useState(null)
  const [alert, setAlert] = useState(null)
  const prevDocType = useRef('')

  useEffect(() => {
    fetchDocumentTypes().then(setDocTypeOptions)
  }, [])

  useEffect(() => {
    if (fixed.documentType && fixed.documentType !== prevDocType.current) {
      fetchDynamicFilters(fixed.documentType).then(setDynamicFilterDefs)
    }
    prevDocType.current = fixed.documentType
  }, [fixed.documentType])

  useEffect(() => {
    if (fixed.documentType && fixed.process) {
      fetchActions(fixed.documentType, fixed.process).then(setActionOptions)
    }
  }, [fixed.documentType, fixed.process])

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }, [])

  const handleFixedChange = useCallback((field, value) => {
    setFixed((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'documentType') {
        next.action = ''
        next.process = ''
        setDynamic({})
        setData(null)
        setActionOptions([])
        if (!value) setDynamicFilterDefs([])
      }
      if (field === 'process') {
        next.action = ''
        setActionOptions([])
      }
      return next
    })
  }, [])

  const handleDynamicChange = useCallback((tag, value) => {
    setDynamic((prev) => ({ ...prev, [tag]: value }))
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    setLoading(true)
    searchDocuments({ ...fixed, dynamicFilters: dynamic })
      .then((result) => {
        setData(result)
        setFiltersCollapsed(true)
      })
      .finally(() => setLoading(false))
  }, [fixed, dynamic])

  const handleClear = useCallback(() => {
    setFixed(INITIAL_FIXED)
    setDynamic({})
    setDynamicFilterDefs([])
    setActionOptions([])
    setData(null)
    setFiltersCollapsed(false)
  }, [])

  const handleBatchAction = useCallback((ids, actionName) => {
    executeBatchAction(ids, actionName).then((res) => {
      showAlert('success', res.message)
    })
  }, [showAlert])

  const handleExport = useCallback(() => {
    exportDocuments(fixed).then((res) => showAlert('success', res.message))
  }, [fixed, showAlert])

  const handleOpenDetail = useCallback((id) => {
    setDetailDocId(id)
  }, [])

  const handleBackToList = useCallback(() => {
    setDetailDocId(null)
  }, [])

  if (detailDocId) {
    return (
      <DocumentDetail
        documentId={detailDocId}
        onBack={handleBackToList}
        userPermissions={userPermissions}
        actionOptions={actionOptions}
      />
    )
  }

  return (
    <div className="documents-page">
      {alert && (
        <div className={`doc-alert ${alert.type}`}>
          <span>{alert.message}</span>
          <button className="alert-close" onClick={() => setAlert(null)}>×</button>
        </div>
      )}

      <form className="doc-filters-panel" onSubmit={handleSubmit}>
        <div className="doc-filters-header">
          <h2>{t.docs.filtersTitle}</h2>
          <div className="doc-filters-header-actions">
            {filtersCollapsed && (
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setFiltersCollapsed(false)}
              >
                {t.docs.showFilters}
              </button>
            )}
            <button type="button" className="ghost-btn" onClick={handleClear}>{t.docs.clearFilters}</button>
          </div>
        </div>

        {!filtersCollapsed && (
          <>
            <FixedFilters
              values={fixed}
              onChange={handleFixedChange}
              documentTypeOptions={docTypeOptions}
              actionOptions={actionOptions}
              t={t}
              loading={loading}
            />

            {dynamicFilterDefs.length > 0 && (
              <DynamicFilters
                filters={dynamicFilterDefs}
                values={dynamic}
                onChange={handleDynamicChange}
                t={t}
              />
            )}
          </>
        )}
      </form>

      <ResultsTable
        data={data}
        t={t}
        onOpenDetail={handleOpenDetail}
        actionOptions={actionOptions}
        onBatchAction={handleBatchAction}
        onExport={handleExport}
      />
    </div>
  )
}

export default DocumentsPage
