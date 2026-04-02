export const menuSections = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', active: true },
      { label: 'eCommerce' },
      { label: 'Analytics' },
      { label: 'Customers' },
      { label: 'Reports' },
    ],
  },
  {
    title: 'SETTINGS',
    items: [{ label: 'Profile' }, { label: 'Billing' }, { label: 'System Logs' }],
  },
]

export const metricCards = [
  { title: 'Total Revenue', value: '$124,500', delta: '+12.4%', tone: 'success' },
  { title: 'New Customers', value: '1,284', delta: '+8.1%', tone: 'primary' },
  { title: 'Open Tickets', value: '47', delta: '-2.7%', tone: 'danger' },
  { title: 'Conversion Rate', value: '6.82%', delta: '+0.9%', tone: 'success' },
]

export const headerData = {
  title: 'Dashboard Overview',
  subtitle: 'Welcome back, Rodrigo. Here is your performance summary.',
  searchPlaceholder: 'Search...',
  primaryActionLabel: 'Create Report',
}

export const revenueSources = [
  { name: 'Direct Sales', value: '68%' },
  { name: 'Social Media', value: '42%' },
  { name: 'Email Campaigns', value: '57%' },
  { name: 'Affiliates', value: '31%' },
]

export const campaignRows = [
  {
    campaign: 'Spring Product Launch',
    channel: 'Email',
    status: 'Active',
    statusTone: 'success',
    spent: '$12,300',
    roi: '4.2x',
  },
  {
    campaign: 'Retargeting Q2',
    channel: 'Social',
    status: 'Paused',
    statusTone: 'warning',
    spent: '$8,940',
    roi: '2.8x',
  },
  {
    campaign: 'Enterprise Leads',
    channel: 'LinkedIn',
    status: 'Active',
    statusTone: 'success',
    spent: '$21,120',
    roi: '5.1x',
  },
  {
    campaign: 'Brand Awareness',
    channel: 'Display',
    status: 'Draft',
    statusTone: 'primary',
    spent: '$4,780',
    roi: '1.9x',
  },
]

export const activities = [
  {
    title: 'New user onboarding completed',
    time: '10 minutes ago',
    color: 'primary',
  },
  {
    title: 'Monthly sales report generated',
    time: '48 minutes ago',
    color: 'success',
  },
  {
    title: 'Customer ticket #3482 escalated',
    time: '2 hours ago',
    color: 'danger',
  },
  {
    title: 'Product feed synchronized',
    time: 'Yesterday, 21:14',
    color: 'warning',
  },
]
