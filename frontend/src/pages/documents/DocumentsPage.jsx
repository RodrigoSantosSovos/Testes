import { useState, useEffect, useCallback, useRef } from 'react'
import { useI18n } from '../../i18n/useI18n'
import { fetchDocumentTypes, fetchActions, fetchDynamicFilters, searchDocuments } from '../../services/documentService'
import FixedFilters from './components/FixedFilters'
import DynamicFilters from './components/DynamicFilters'
import ResultsTable from './components/ResultsTable'
import './DocumentsPage.css'

const INITIAL_FIXED = {
  documentType: '',
  process: '',
  action: '',
  situation: '-1',
  historic: false,
}

function DocumentsPage() {
  const { t } = useI18n()

  const [docTypeOptions, setDocTypeOptions] = useState([])
  const [actionOptions, setActionOptions] = useState([])
  const [dynamicFilterDefs, setDynamicFilterDefs] = useState([])
  const [fixed, setFixed] = useState(INITIAL_FIXED)
  const [dynamic, setDynamic] = useState({})
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const prevDocType = useRef('')
  const prevProcess = useRef('')

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
    prevProcess.current = fixed.process
  }, [fixed.documentType, fixed.process])

  const handleFixedChange = useCallback((field, value) => {
    setFixed((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'documentType') {
        next.action = ''
        next.process = ''
        setDynamic({})
        setResults(null)
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
      .then(setResults)
      .finally(() => setLoading(false))
  }, [fixed, dynamic])

  const handleClear = useCallback(() => {
    setFixed(INITIAL_FIXED)
    setDynamic({})
    setDynamicFilterDefs([])
    setActionOptions([])
    setResults(null)
  }, [])

  return (
    <div className="documents-page">
      <form className="doc-filters-panel" onSubmit={handleSubmit}>
        <div className="doc-filters-header">
          <h2>{t.docs.filtersTitle}</h2>
          <button type="button" className="ghost-btn" onClick={handleClear}>{t.docs.clearFilters}</button>
        </div>

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
      </form>

      <ResultsTable results={results} t={t} />
    </div>
  )
}

export default DocumentsPage
