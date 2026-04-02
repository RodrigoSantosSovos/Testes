import { useMemo } from 'react'
import { useI18n } from '../i18n/useI18n'

function useDashboardData() {
  const { t } = useI18n()
  const d = t.dashboard
  const s = t.sidebar

  return useMemo(() => ({
    menuSections: [
      {
        title: s.main,
        items: [
          { label: s.dashboard, page: 'dashboard' },
          { label: s.crudDemo, page: 'crud' },
          { label: s.ecommerce },
          { label: s.analytics },
          { label: s.customers },
          { label: s.reports },
        ],
      },
      {
        title: s.settings,
        items: [
          { label: s.profile },
          { label: s.billing },
          { label: s.systemLogs },
        ],
      },
    ],

    headerData: {
      title: d.title,
      subtitle: d.subtitle,
      searchPlaceholder: t.topbar.search,
      primaryActionLabel: t.topbar.createReport,
    },

    metricCards: [
      { title: d.totalRevenue, value: '$124,500', delta: '+12.4%', tone: 'success' },
      { title: d.newCustomers, value: '1,284', delta: '+8.1%', tone: 'primary' },
      { title: d.openTickets, value: '47', delta: '-2.7%', tone: 'danger' },
      { title: d.conversionRate, value: '6.82%', delta: '+0.9%', tone: 'success' },
    ],

    revenueSources: [
      { name: d.directSales, value: '68%' },
      { name: d.socialMedia, value: '42%' },
      { name: d.emailCampaigns, value: '57%' },
      { name: d.affiliates, value: '31%' },
    ],

    campaignRows: [
      { campaign: d.springLaunch, channel: 'Email', status: d.active, statusTone: 'success', spent: '$12,300', roi: '4.2x' },
      { campaign: d.retargetingQ2, channel: 'Social', status: d.paused, statusTone: 'warning', spent: '$8,940', roi: '2.8x' },
      { campaign: d.enterpriseLeads, channel: 'LinkedIn', status: d.active, statusTone: 'success', spent: '$21,120', roi: '5.1x' },
      { campaign: d.brandAwareness, channel: 'Display', status: d.draft, statusTone: 'primary', spent: '$4,780', roi: '1.9x' },
    ],

    activities: [
      { title: d.userOnboarding, time: d.minutesAgo.replace('{n}', '10'), color: 'primary' },
      { title: d.salesReport, time: d.minutesAgo.replace('{n}', '48'), color: 'success' },
      { title: d.ticketEscalated, time: d.hoursAgo.replace('{n}', '2'), color: 'danger' },
      { title: d.productSync, time: d.yesterday, color: 'warning' },
    ],
  }), [t, d, s])
}

export default useDashboardData
