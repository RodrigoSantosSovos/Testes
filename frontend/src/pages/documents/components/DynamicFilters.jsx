import FilterField from './FilterField'

function DynamicFilters({ filters, values, onChange, t }) {
  if (!filters.length) return null

  return (
    <div className="doc-dynamic-filters">
      <h3 className="doc-dynamic-title">{t.docs.dynamicFilters}</h3>
      <div className="doc-dynamic-grid">
        {filters.map((filter) => (
          <FilterField
            key={filter.tag}
            filter={filter}
            value={values[filter.tag]}
            onChange={onChange}
            t={t}
          />
        ))}
      </div>
    </div>
  )
}

export default DynamicFilters
