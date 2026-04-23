const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  }

  const token = localStorage.getItem('auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, config)
  if (!response.ok) {
    let detail = `API Error: ${response.status}`
    try { const body = await response.json(); detail = body.detail || body.title || detail } catch { /* ignore */ }
    const error = new Error(detail)
    error.status = response.status
    throw error
  }

  const ct = response.headers.get('content-type') || ''
  if (ct.includes('application/json')) return response.json()
  if (ct.includes('application/octet-stream') || ct.includes('application/pdf') || ct.includes('application/xml')) return response.blob()
  return response.text()
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (endpoint, data) => request(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
}

export default api
