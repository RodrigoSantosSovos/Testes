import api from './api'

export async function login(username, password) {
  const data = await api.post('/auth/login', { username, password })
  localStorage.setItem('auth-token', data.token)

  const payload = parseJwt(data.token)
  const permissions = payload.permission || []

  return {
    username: data.username,
    name: data.name,
    permissions: Array.isArray(permissions) ? permissions : [permissions],
  }
}

export async function logout() {
  localStorage.removeItem('auth-token')
}

export function hasPermission(userPermissions, required) {
  if (!required) return true
  return userPermissions.includes(required)
}

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return {}
  }
}
