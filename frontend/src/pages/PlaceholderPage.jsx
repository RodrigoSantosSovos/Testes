function PlaceholderPage({ title, description, icon }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default PlaceholderPage
