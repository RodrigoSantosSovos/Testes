import Panel from '../common/Panel'

function CampaignTable({ rows }) {
  return (
    <Panel title="Campaign Performance" className="panel panel-large">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Channel</th>
              <th>Status</th>
              <th>Spent</th>
              <th>ROI</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.campaign}>
                <td>{row.campaign}</td>
                <td>{row.channel}</td>
                <td>{row.status}</td>
                <td>{row.spent}</td>
                <td>{row.roi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

export default CampaignTable
