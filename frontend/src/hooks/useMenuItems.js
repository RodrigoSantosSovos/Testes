import { useMemo } from 'react'
import { useI18n } from '../i18n/useI18n'
import { menuConfig } from '../config/menuConfig'
import { hasPermission } from '../services/authService'

function useMenuItems(userPermissions = []) {
  const { t } = useI18n()
  const m = t.menu

  return useMemo(() => {
    return menuConfig
      .filter((item) => hasPermission(userPermissions, item.permission))
      .map((item) => ({
        ...item,
        label: m[item.labelKey] || item.labelKey,
        children: item.children?.map((child) => ({
          ...child,
          label: m[child.labelKey] || child.labelKey,
        })),
      }))
  }, [userPermissions, m])
}

export default useMenuItems
