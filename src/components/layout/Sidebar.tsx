import {
  BarChart3,
  ChevronLeft,
  FileText,
  LayoutDashboard,
  Radio,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_NAME } from "@/config/branding";
import { cn } from "@/lib/cn";

const navItems = [
  { key: "overview", icon: LayoutDashboard, active: true },
  { key: "monitoring", icon: Radio, active: false },
  { key: "documents", icon: FileText, active: false },
  { key: "reports", icon: BarChart3, active: false },
  { key: "settings", icon: Settings, active: false },
] as const;

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label={t("panel.close")}
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--ff-sidebar)]/50 bg-[var(--ff-sidebar)] text-[var(--ff-sidebar-text)] transition-[width,transform] duration-200 ease-out lg:static lg:translate-x-0",
          collapsed ? "w-[72px]" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-white/5 px-3",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && (
            <div className="min-w-0 px-1">
              <p className="truncate font-semibold tracking-tight text-white">
                {APP_NAME}
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {t("branding.tagline")}
              </p>
            </div>
          )}
          {collapsed && (
            <span
              className="flex size-9 items-center justify-center rounded-lg bg-teal-500/15 text-sm font-bold text-[var(--ff-sidebar-active)]"
              aria-hidden
            >
              FF
            </span>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="hidden size-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/5 hover:text-white lg:inline-flex"
            aria-label={t("a11y.sidebarToggle")}
          >
            <ChevronLeft
              className={cn(
                "size-4 transition-transform",
                collapsed && "rotate-180",
              )}
            />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 p-2" aria-label="Main">
          {navItems.map(({ key, icon: Icon, active }) => (
            <button
              key={key}
              type="button"
              title={collapsed ? t(`nav.${key}`) : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                collapsed && "justify-center px-2",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "size-[18px] shrink-0",
                  active && "text-[var(--ff-sidebar-active)]",
                )}
              />
              {!collapsed && <span>{t(`nav.${key}`)}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/5 p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg bg-white/5 p-2",
              collapsed && "justify-center p-2",
            )}
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-600/30 text-xs font-semibold text-teal-200"
              aria-hidden
            >
              AR
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {t("user.name")}
                </p>
                <p className="truncate text-xs text-slate-400">{t("user.org")}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
