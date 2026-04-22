const ALL_AUTHORIZATIONS = [
  { authorizationId: 1, name: 'UI::Main::Menu_Dashboards', description: 'Access Dashboard menu' },
  { authorizationId: 2, name: 'UI::Main::Menu_Documents', description: 'Access Documents menu' },
  { authorizationId: 3, name: 'UI::Main::Menu_Reports', description: 'Access Reports/Processes menu' },
  { authorizationId: 4, name: 'UI::Main::Menu_Settings', description: 'Access Configuration menu' },
  { authorizationId: 5, name: 'UI::Main::Menu_Security', description: 'Access Security menu' },
  { authorizationId: 6, name: 'UI::Main::Menu_ReceptionLog', description: 'Access Reception Log menu' },
  { authorizationId: 7, name: 'UI::Main::Menu_Workflow', description: 'Access Workflow menu' },
  { authorizationId: 8, name: 'UI::Main::Document_Support', description: 'Access Support/Flags/Messages tabs in document detail' },
  { authorizationId: 9, name: 'UI::Main::Document_Delete', description: 'Delete documents from Support tab' },
  { authorizationId: 10, name: 'UI::Main::Document_Export', description: 'Export documents to Excel' },
  { authorizationId: 11, name: 'UI::Main::Document_Upload', description: 'Upload documents (XML/RPS/XLS)' },
  { authorizationId: 12, name: 'UI::Main::Action_Authorize', description: 'Execute authorization actions' },
  { authorizationId: 13, name: 'UI::Main::Action_Cancel', description: 'Execute cancellation actions' },
  { authorizationId: 14, name: 'UI::Main::Action_Reprocess', description: 'Execute reprocess actions' },
  { authorizationId: 15, name: 'UI::Main::Config_General', description: 'Edit general configuration constants' },
  { authorizationId: 16, name: 'UI::Main::Config_RulePrint', description: 'Edit print rules' },
  { authorizationId: 17, name: 'UI::Main::Config_RuleDistribution', description: 'Edit distribution rules' },
  { authorizationId: 18, name: 'UI::Main::Config_RuleContingency', description: 'Edit contingency rules' },
]

let nextGroupId = 4
let mockGroups = [
  { groupId: 1, name: 'system_administrator', description: 'Grupo de administradores de sistema' },
  { groupId: 2, name: 'operators', description: 'Grupo de operadores' },
  { groupId: 3, name: 'viewers', description: 'Grupo de visualizadores' },
]

let mockAuthGroups = [
  ...ALL_AUTHORIZATIONS.map((a) => ({ groupId: 1, authorizationId: a.authorizationId })),
  { groupId: 2, authorizationId: 1 }, { groupId: 2, authorizationId: 2 }, { groupId: 2, authorizationId: 3 },
  { groupId: 2, authorizationId: 6 }, { groupId: 2, authorizationId: 10 }, { groupId: 2, authorizationId: 12 },
  { groupId: 3, authorizationId: 1 }, { groupId: 3, authorizationId: 2 },
]

export function getAllAuthorizations() { return ALL_AUTHORIZATIONS }

export async function getGroups() {
  await new Promise((r) => setTimeout(r, 200))
  return [...mockGroups].sort((a, b) => a.groupId - b.groupId)
}

export async function getGroup(groupId) {
  await new Promise((r) => setTimeout(r, 100))
  return mockGroups.find((g) => g.groupId === groupId) || null
}

export async function createGroup(name, description) {
  await new Promise((r) => setTimeout(r, 300))
  const group = { groupId: nextGroupId++, name, description }
  mockGroups = [...mockGroups, group]
  return { success: true, groupId: group.groupId }
}

export async function updateGroup(groupId, name, description) {
  await new Promise((r) => setTimeout(r, 300))
  mockGroups = mockGroups.map((g) => g.groupId === groupId ? { ...g, name, description } : g)
  return { success: true }
}

export async function getGroupAuthorizations(groupId) {
  await new Promise((r) => setTimeout(r, 150))
  const assigned = mockAuthGroups.filter((ag) => ag.groupId === groupId)
  return assigned.map((ag) => ALL_AUTHORIZATIONS.find((a) => a.authorizationId === ag.authorizationId)).filter(Boolean)
}

export async function getAvailableAuthorizations(groupId) {
  await new Promise((r) => setTimeout(r, 100))
  const assignedIds = new Set(mockAuthGroups.filter((ag) => ag.groupId === groupId).map((ag) => ag.authorizationId))
  return ALL_AUTHORIZATIONS.filter((a) => !assignedIds.has(a.authorizationId))
}

export async function addAuthorization(groupId, authorizationId) {
  await new Promise((r) => setTimeout(r, 200))
  const exists = mockAuthGroups.some((ag) => ag.groupId === groupId && ag.authorizationId === authorizationId)
  if (exists) return { success: false }
  mockAuthGroups = [...mockAuthGroups, { groupId, authorizationId }]
  return { success: true }
}

export async function removeAuthorization(groupId, authorizationId) {
  await new Promise((r) => setTimeout(r, 200))
  mockAuthGroups = mockAuthGroups.filter((ag) => !(ag.groupId === groupId && ag.authorizationId === authorizationId))
  return { success: true }
}
