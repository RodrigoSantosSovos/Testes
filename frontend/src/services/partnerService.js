let nextId = 6

let mockPartners = [
  { partnerId: 1, name: 'Sovos Compliance' },
  { partnerId: 2, name: 'SAP SE' },
  { partnerId: 3, name: 'Oracle Corporation' },
  { partnerId: 4, name: 'Totvs S.A.' },
  { partnerId: 5, name: 'Senior Sistemas' },
]

const MOCK_DEPS = {
  1: { companies: 3, users: 2, workflows: 1 },
  2: { companies: 1, users: 0, workflows: 0 },
  3: { companies: 0, users: 0, workflows: 0 },
}

export async function getPartners() {
  await new Promise((r) => setTimeout(r, 200))
  return [...mockPartners].sort((a, b) => a.partnerId - b.partnerId)
}

export async function getPartner(partnerId) {
  await new Promise((r) => setTimeout(r, 100))
  return mockPartners.find((p) => p.partnerId === partnerId) || null
}

export async function createPartner(name) {
  await new Promise((r) => setTimeout(r, 300))
  const partner = { partnerId: nextId++, name }
  mockPartners = [...mockPartners, partner]
  return { success: true, partner }
}

export async function updatePartner(partnerId, name) {
  await new Promise((r) => setTimeout(r, 300))
  mockPartners = mockPartners.map((p) => p.partnerId === partnerId ? { ...p, name } : p)
  return { success: true }
}

export async function deletePartner(partnerId) {
  await new Promise((r) => setTimeout(r, 300))
  const deps = MOCK_DEPS[partnerId]
  if (deps && (deps.companies > 0 || deps.users > 0 || deps.workflows > 0)) {
    return {
      success: false,
      hasDependencies: true,
      dependencies: deps,
    }
  }
  mockPartners = mockPartners.filter((p) => p.partnerId !== partnerId)
  return { success: true }
}

export async function checkDependencies(partnerId) {
  await new Promise((r) => setTimeout(r, 100))
  return MOCK_DEPS[partnerId] || { companies: 0, users: 0, workflows: 0 }
}
