const MOCK_USER = {
  username: 'admin',
  name: 'Rodrigo Santos',
  permissions: [
    'UI::Main::Menu_Dashboards',
    'UI::Main::Menu_Reports',
    'UI::Main::Menu_Settings',
    'UI::Main::Menu_Security',
    'UI::Main::Menu_ReceptionLog',
  ],
}

export async function login(username, password) {
  await new Promise((r) => setTimeout(r, 800))

  if (username === 'admin' && password === 'admin') {
    localStorage.setItem('auth-token', 'mock-jwt-token')
    return { ...MOCK_USER }
  }

  throw new Error('INVALID_CREDENTIALS')
}

export async function logout() {
  localStorage.removeItem('auth-token')
}

export function hasPermission(userPermissions, required) {
  if (!required) return true
  return userPermissions.includes(required)
}
