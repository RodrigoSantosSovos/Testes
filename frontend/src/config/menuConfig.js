export const menuConfig = [
  {
    id: 'dashboard',
    labelKey: 'dashboard',
    icon: 'dashboard',
    permission: 'UI::Main::Menu_Dashboards',
    page: 'dashboard',
  },
  {
    id: 'documents',
    labelKey: 'documents',
    icon: 'documents',
    page: 'documents',
  },
  {
    id: 'processes',
    labelKey: 'processes',
    icon: 'processes',
    permission: 'UI::Main::Menu_Reports',
    page: 'processes',
  },
  {
    id: 'configuration',
    labelKey: 'configuration',
    icon: 'settings',
    permission: 'UI::Main::Menu_Settings',
    children: [
      { id: 'config-general', labelKey: 'configGeneral', page: 'config-general' },
      { id: 'config-rule-print', labelKey: 'configRulePrint', page: 'config-rule-print' },
      { id: 'config-rule-distribution', labelKey: 'configRuleDistribution', page: 'config-rule-distribution' },
    ],
  },
  {
    id: 'security',
    labelKey: 'security',
    icon: 'security',
    permission: 'UI::Main::Menu_Security',
    children: [
      { id: 'sec-partner', labelKey: 'secPartner', page: 'sec-partner' },
      { id: 'sec-companies', labelKey: 'secCompanies', page: 'sec-companies' },
      { id: 'sec-users', labelKey: 'secUsers', page: 'sec-users' },
      { id: 'sec-business-group', labelKey: 'secBusinessGroup', page: 'sec-business-group' },
    ],
  },
  {
    id: 'log-reception',
    labelKey: 'logReception',
    icon: 'log',
    permission: 'UI::Main::Menu_ReceptionLog',
    page: 'log-reception',
  },
  {
    id: 'idoc-generation',
    labelKey: 'idocGeneration',
    icon: 'idoc',
    page: 'idoc-generation',
  },
  {
    id: 'utilities',
    labelKey: 'utilities',
    icon: 'utilities',
    children: [
      { id: 'util-search', labelKey: 'utilSearch', page: 'util-search' },
      { id: 'util-export', labelKey: 'utilExport', page: 'util-export' },
      { id: 'util-country', labelKey: 'utilCountry', page: 'util-country' },
      { id: 'util-queue', labelKey: 'utilQueue', page: 'util-queue' },
    ],
  },
]
