function Sidebar({ brand, sections }) {
  return (
    <aside className="sidebar">
      <div className="brand">{brand}</div>

      {sections.map((section) => (
        <nav className="menu" key={section.title}>
          <p className="menu-title">{section.title}</p>
          {section.items.map((item) => (
            <button
              key={item.label}
              className={`menu-item ${item.active ? 'active' : ''}`.trim()}
            >
              {item.label}
            </button>
          ))}
        </nav>
      ))}
    </aside>
  )
}

export default Sidebar
