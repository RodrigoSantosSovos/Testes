const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).{10,24}$/

let nextId = 6
let mockUsers = [
  { tfUserId: 1, tfGroupId: 1, name: 'Rodrigo Santos', username: 'rodrigo@sovos.com', email: 'rodrigo@sovos.com', phone: '11999001234', mobile: '11999001234', isAproved: true, isLockedOut: false, createdDate: '2022-01-15T10:00:00', lastLoginDate: '2026-04-01T14:30:00', lastPasswordChangeDate: '2025-12-01T08:00:00' },
  { tfUserId: 2, tfGroupId: 1, name: 'Ana Silva', username: 'ana@sovos.com', email: 'ana@sovos.com', phone: '21988005678', mobile: '', isAproved: true, isLockedOut: false, createdDate: '2022-03-20T14:30:00', lastLoginDate: '2026-03-28T09:15:00', lastPasswordChangeDate: '2025-11-10T10:00:00' },
  { tfUserId: 3, tfGroupId: 2, name: 'Carlos Mendes', username: 'carlos@empresa.com', email: 'carlos@empresa.com', phone: '31977009012', mobile: '31977009012', isAproved: true, isLockedOut: true, createdDate: '2023-06-10T09:00:00', lastLoginDate: '2025-08-15T16:45:00', lastPasswordChangeDate: '2025-06-01T12:00:00' },
  { tfUserId: 4, tfGroupId: 1, name: 'Beatriz Rocha', username: 'beatriz@sovos.com', email: 'beatriz@sovos.com', phone: '41966003456', mobile: '', isAproved: false, isLockedOut: false, createdDate: '2024-01-05T11:00:00', lastLoginDate: null, lastPasswordChangeDate: null },
  { tfUserId: 5, tfGroupId: 3, name: 'Daniel Oliveira', username: 'daniel@partner.com', email: 'daniel@partner.com', phone: '51955007890', mobile: '51955007890', isAproved: true, isLockedOut: false, createdDate: '2024-06-15T08:30:00', lastLoginDate: '2026-03-30T11:20:00', lastPasswordChangeDate: '2026-01-15T09:00:00' },
]

let mockCompanyUsers = [
  { tfUserId: 1, companyId: 'COMP-001', companyName: 'Sovos Brasil LTDA' },
  { tfUserId: 1, companyId: 'COMP-002', companyName: 'Sovos Argentina S.A.' },
  { tfUserId: 2, companyId: 'COMP-001', companyName: 'Sovos Brasil LTDA' },
  { tfUserId: 3, companyId: 'COMP-004', companyName: 'Empresa Teste Nacional' },
  { tfUserId: 5, companyId: 'COMP-005', companyName: 'Distribuidora Central S.A.' },
]

const MOCK_GROUPS = [
  { groupId: 1, description: 'Administrators' },
  { groupId: 2, description: 'Operators' },
  { groupId: 3, description: 'Viewers' },
]

const MOCK_COMPANIES_FOR_ASSIGN = [
  { value: 'COMP-001', text: 'COMP-001 - Sovos Brasil LTDA' },
  { value: 'COMP-002', text: 'COMP-002 - Sovos Argentina S.A.' },
  { value: 'COMP-003', text: 'COMP-003 - Sovos Chile SpA' },
  { value: 'COMP-004', text: 'COMP-004 - Empresa Teste Nacional' },
  { value: 'COMP-005', text: 'COMP-005 - Distribuidora Central S.A.' },
]

export function getGroups() { return MOCK_GROUPS }
export function getCompaniesForAssign() { return MOCK_COMPANIES_FOR_ASSIGN }

export async function getUsers() {
  await new Promise((r) => setTimeout(r, 200))
  return [...mockUsers]
}

export async function getUser(tfUserId) {
  await new Promise((r) => setTimeout(r, 100))
  return mockUsers.find((u) => u.tfUserId === tfUserId) || null
}

export async function createUser(data) {
  await new Promise((r) => setTimeout(r, 400))
  const errors = validateUserData(data, null)
  if (errors.length) return { success: false, errors }
  const user = { ...data, tfUserId: nextId++, username: data.email, createdDate: new Date().toISOString(), lastLoginDate: null, lastPasswordChangeDate: null, isAproved: true }
  mockUsers = [...mockUsers, user]
  return { success: true, tfUserId: user.tfUserId }
}

export async function updateUser(tfUserId, data) {
  await new Promise((r) => setTimeout(r, 400))
  const errors = validateUserData(data, tfUserId)
  if (errors.length) return { success: false, errors }
  mockUsers = mockUsers.map((u) => u.tfUserId === tfUserId ? { ...u, ...data, username: data.email } : u)
  return { success: true }
}

export async function deleteUser(tfUserId) {
  await new Promise((r) => setTimeout(r, 300))
  mockUsers = mockUsers.filter((u) => u.tfUserId !== tfUserId)
  mockCompanyUsers = mockCompanyUsers.filter((cu) => cu.tfUserId !== tfUserId)
  return { success: true }
}

export async function lockUser(tfUserId) {
  await new Promise((r) => setTimeout(r, 200))
  mockUsers = mockUsers.map((u) => u.tfUserId === tfUserId ? { ...u, isLockedOut: true } : u)
  return { success: true }
}

export async function unlockUser(tfUserId) {
  await new Promise((r) => setTimeout(r, 200))
  mockUsers = mockUsers.map((u) => u.tfUserId === tfUserId ? { ...u, isLockedOut: false } : u)
  return { success: true }
}

export async function getUserCompanies(tfUserId) {
  await new Promise((r) => setTimeout(r, 150))
  return mockCompanyUsers.filter((cu) => cu.tfUserId === tfUserId)
}

export async function addUserCompany(tfUserId, companyId) {
  await new Promise((r) => setTimeout(r, 200))
  const exists = mockCompanyUsers.some((cu) => cu.tfUserId === tfUserId && cu.companyId === companyId)
  if (exists) return { success: false, error: 'ALREADY_ASSIGNED' }
  const comp = MOCK_COMPANIES_FOR_ASSIGN.find((c) => c.value === companyId)
  mockCompanyUsers = [...mockCompanyUsers, { tfUserId, companyId, companyName: comp?.text?.split(' - ')[1] || companyId }]
  return { success: true }
}

export async function removeUserCompany(tfUserId, companyId) {
  await new Promise((r) => setTimeout(r, 200))
  mockCompanyUsers = mockCompanyUsers.filter((cu) => !(cu.tfUserId === tfUserId && cu.companyId === companyId))
  return { success: true }
}

function validateUserData(data, excludeUserId) {
  const errors = []
  if (!data.email) errors.push('EMAIL_REQUIRED')
  else {
    try { new URL(`mailto:${data.email}`) } catch { errors.push('EMAIL_INVALID') }
    const dup = mockUsers.find((u) => u.email === data.email && u.tfUserId !== excludeUserId)
    if (dup) errors.push('EMAIL_DUPLICATE')
  }
  if (!data.name) errors.push('NAME_REQUIRED')
  if (!data.phone) errors.push('PHONE_REQUIRED')
  if (data.password && !PASSWORD_REGEX.test(data.password)) errors.push('PASSWORD_WEAK')
  if (data.password !== data.confirmPassword) errors.push('PASSWORD_MISMATCH')
  return errors
}

export function validatePassword(password) {
  return PASSWORD_REGEX.test(password)
}
