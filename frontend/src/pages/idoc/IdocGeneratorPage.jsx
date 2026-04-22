import { useState, useCallback, useMemo } from 'react'
import { SEGMENT_DEFINITIONS, SEGMENT_ORDER } from '../../config/idocDefinitions'
import { DEFAULT_IDOC } from '../../config/idocDefault'
import './IdocGeneratorPage.css'

function IdocGeneratorPage() {
  const [idocText, setIdocText] = useState('')
  const [segmentData, setSegmentData] = useState(() => initSegmentData())
  const [enabledSegments, setEnabledSegments] = useState(() => new Set())
  const [collapsedSegments, setCollapsedSegments] = useState(() => new Set(SEGMENT_ORDER))
  const [ediDc40Line, setEdiDc40Line] = useState('')
  const [filter, setFilter] = useState('')
  const [alert, setAlert] = useState(null)

  const showAlert = useCallback((type, msg) => {
    setAlert({ type, msg }); setTimeout(() => setAlert(null), 3000)
  }, [])

  const handleLoadIdoc = useCallback(() => {
    if (!idocText.trim()) { showAlert('warning', 'Cole o conteúdo do IDOC antes de carregar.'); return }
    const lines = idocText.split('\n').filter((l) => l.trim())
    const newData = { ...initSegmentData() }
    const newEnabled = new Set()
    let foundHeader = ''

    for (const line of lines) {
      const segName = line.substring(0, 30).trim()
      const def = SEGMENT_DEFINITIONS[segName]
      if (!def) {
        if (segName.startsWith('EDI_DC40') || line.includes('EDI_DC40')) { foundHeader = line; continue }
        continue
      }
      if (def.isFixedHeader) { foundHeader = line; continue }
      newEnabled.add(segName)
      const dataStart = def.dataOffset || 63
      const rawData = line.substring(30 + dataStart - 63)
      def.fields.forEach((field) => {
        const val = rawData.substring(field.position, field.position + field.length).trimEnd()
        newData[segName] = newData[segName] || {}
        newData[segName][field.name] = val
      })
    }

    setSegmentData(newData)
    setEnabledSegments(newEnabled)
    if (foundHeader) setEdiDc40Line(foundHeader)
    setCollapsedSegments(new Set())
    showAlert('success', `IDOC carregado — ${newEnabled.size} segmentos encontrados.`)
  }, [idocText, showAlert])

  const handleGenerateIdoc = useCallback(() => {
    const lines = []
    if (ediDc40Line) { lines.push(ediDc40Line) } else {
      const defaultLines = DEFAULT_IDOC.split('\n').filter((l) => l.trim())
      if (defaultLines[0]) lines.push(defaultLines[0])
    }

    SEGMENT_ORDER.forEach((segName) => {
      if (!enabledSegments.has(segName)) return
      const def = SEGMENT_DEFINITIONS[segName]
      if (!def || def.isFixedHeader) return
      const data = segmentData[segName] || {}
      const totalLen = def.fields.reduce((max, f) => Math.max(max, f.position + f.length), 0)
      let fieldStr = ''
      for (let i = 0; i < totalLen; i++) fieldStr += ' '
      const arr = [...fieldStr]
      def.fields.forEach((f) => {
        const val = (data[f.name] || '').padEnd(f.length).substring(0, f.length)
        for (let i = 0; i < f.length; i++) arr[f.position + i] = val[i]
      })
      const header = segName.padEnd(30) + '0000000001'.padEnd(33)
      lines.push(header + arr.join(''))
    })

    const result = lines.join('\n')
    setIdocText(result)
    navigator.clipboard.writeText(result).catch(() => {})
    showAlert('success', `IDOC gerado com ${lines.length} linhas. Copiado para o clipboard.`)
  }, [segmentData, enabledSegments, ediDc40Line, showAlert])

  const handleClear = useCallback(() => {
    setIdocText('')
    setSegmentData(initSegmentData())
    setEnabledSegments(new Set())
    setEdiDc40Line('')
    showAlert('success', 'Todos os campos foram limpos.')
  }, [showAlert])

  const handleFieldChange = useCallback((segName, fieldName, value) => {
    setSegmentData((prev) => ({ ...prev, [segName]: { ...prev[segName], [fieldName]: value } }))
  }, [])

  const toggleSegmentEnabled = useCallback((segName) => {
    setEnabledSegments((prev) => {
      const next = new Set(prev)
      next.has(segName) ? next.delete(segName) : next.add(segName)
      return next
    })
  }, [])

  const toggleCollapse = useCallback((segName) => {
    setCollapsedSegments((prev) => {
      const next = new Set(prev)
      next.has(segName) ? next.delete(segName) : next.add(segName)
      return next
    })
  }, [])

  const expandAll = useCallback(() => setCollapsedSegments(new Set()), [])
  const collapseAll = useCallback(() => setCollapsedSegments(new Set(SEGMENT_ORDER)), [])

  const filteredSegments = useMemo(() => {
    if (!filter) return SEGMENT_ORDER
    const q = filter.toLowerCase()
    return SEGMENT_ORDER.filter((s) => {
      const def = SEGMENT_DEFINITIONS[s]
      return s.toLowerCase().includes(q) || def?.description?.toLowerCase().includes(q)
    })
  }, [filter])

  return (
    <div className="idoc-page">
      {alert && <div className={`doc-alert ${alert.type}`}><span>{alert.msg}</span></div>}

      <div className="idoc-controls">
        <button className="primary-btn" onClick={handleLoadIdoc}>📥 Carregar IDOC</button>
        <button className="success-btn" onClick={handleGenerateIdoc}>⚡ Gerar IDOC</button>
        <button className="danger-btn" onClick={handleClear}>🗑️ Limpar Tudo</button>
        <button className="ghost-btn" onClick={expandAll}>▼ Expandir Todos</button>
        <button className="ghost-btn" onClick={collapseAll}>▶ Recolher Todos</button>
      </div>

      <div className="idoc-info">
        <strong>Nota:</strong> Posição 0 no XML corresponde à posição 64 no IDOC (após o header do segmento de 63 caracteres).
        Os campos são posicionais e preenchidos com espaços à direita até completar o tamanho definido.
      </div>

      <div className="idoc-textarea-wrap">
        <label>Cole o conteúdo do IDOC aqui ou edite os campos abaixo:</label>
        <textarea
          value={idocText}
          onChange={(e) => setIdocText(e.target.value)}
          placeholder="Cole o IDOC aqui e clique em 'Carregar IDOC' para visualizar os campos..."
          rows="6"
          spellCheck="false"
        />
      </div>

      <div className="idoc-filter">
        <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filtrar segmentos..." />
        <span className="idoc-filter-count">{filteredSegments.length} / {SEGMENT_ORDER.length}</span>
      </div>

      <div className="idoc-segments">
        {filteredSegments.map((segName) => {
          const def = SEGMENT_DEFINITIONS[segName]
          if (!def) return null
          const isCollapsed = collapsedSegments.has(segName)
          const isEnabled = enabledSegments.has(segName)
          const isFixed = def.isFixedHeader

          return (
            <div key={segName} className={`idoc-segment ${isEnabled ? 'enabled' : ''} ${isFixed ? 'fixed' : ''}`}>
              <div className="idoc-segment-header" onClick={() => toggleCollapse(segName)}>
                <span className="idoc-toggle">{isCollapsed ? '▶' : '▼'}</span>
                <span className="idoc-seg-name">{segName}</span>
                <span className="idoc-seg-desc">{def.description}</span>
                {!isFixed && (
                  <label className="idoc-seg-check" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={isEnabled} onChange={() => toggleSegmentEnabled(segName)} />
                    Incluir
                  </label>
                )}
                {isFixed && <span className="badge primary">Fixo</span>}
              </div>

              {!isCollapsed && (
                <div className="idoc-segment-body">
                  {isFixed ? (
                    <p className="idoc-fixed-info">Esta linha de header é fixa e será mantida intacta. Ao carregar um IDOC, a linha EDI_DC40 será preservada automaticamente.</p>
                  ) : def.fields.length === 0 ? (
                    <p className="idoc-no-fields">Nenhum campo definido para este segmento.</p>
                  ) : (
                    <table>
                      <thead><tr><th>Pos</th><th>Tam</th><th>Campo SAP</th><th>WebService</th><th>Descrição</th><th>Valor</th></tr></thead>
                      <tbody>
                        {def.fields.map((field) => (
                          <tr key={field.name} className={segmentData[segName]?.[field.name] ? 'has-value' : ''}>
                            <td className="idoc-td-num">{field.position}</td>
                            <td className="idoc-td-num">{field.length}</td>
                            <td className="idoc-td-name">{field.name}</td>
                            <td className="idoc-td-alias">{field.alias || '—'}</td>
                            <td className="idoc-td-desc">{field.description}</td>
                            <td className="idoc-td-value">
                              <input
                                type="text"
                                value={segmentData[segName]?.[field.name] || ''}
                                onChange={(e) => handleFieldChange(segName, field.name, e.target.value)}
                                maxLength={field.length}
                                placeholder={`(${field.length})`}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function initSegmentData() {
  const data = {}
  SEGMENT_ORDER.forEach((segName) => {
    const def = SEGMENT_DEFINITIONS[segName]
    if (!def) return
    data[segName] = {}
    def.fields.forEach((f) => { data[segName][f.name] = '' })
  })
  return data
}

export default IdocGeneratorPage
