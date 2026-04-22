import { useState, useEffect } from 'react'
import { fetchDashboardData } from '../services/dashboardService'

function useDashboardData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData().then((d) => { setData(d); setLoading(false) })
  }, [])

  return { data, loading }
}

export default useDashboardData
