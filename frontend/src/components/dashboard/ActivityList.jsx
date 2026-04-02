function ActivityList({ activities }) {
  return (
    <ul className="activity-list">
      {activities.map((item) => (
        <li key={item.title}>
          <span className={`dot ${item.color}`} />
          <div>
            <p>{item.title}</p>
            <small>{item.time}</small>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ActivityList
