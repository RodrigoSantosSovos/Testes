function Panel({ title, className, action, children }) {
  return (
    <article className={`panel ${className ?? ''}`.trim()}>
      <div className="panel-head">
        <h2>{title}</h2>
        {action ?? null}
      </div>
      {children}
    </article>
  )
}

export default Panel
