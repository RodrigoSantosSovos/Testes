function Panel({ title, actionLabel, large = false, children }) {
  return (
    <article className={`panel ${large ? 'panel-large' : ''}`.trim()}>
      <div className="panel-head">
        <h2>{title}</h2>
        {actionLabel ? <button className="ghost-btn">{actionLabel}</button> : null}
      </div>
      {children}
    </article>
  )
}

export default Panel
