import {
  Bell,
  ChevronDown,
  Globe,
  Menu,
  Moon,
  Search,
  Sun,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";

export function Header({
  onOpenSearch,
  onOpenMobileNav,
  theme,
  onToggleTheme,
  onLanguageChange,
}: {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLanguageChange: (lng: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenSearch]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
        setLangOpen(false);
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const languages = [
    { code: "pt-BR", label: t("language.ptBR") },
    { code: "en", label: t("language.en") },
    { code: "es", label: t("language.es") },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary lg:hidden"
          onClick={onOpenMobileNav}
          aria-label={t("a11y.openMenu")}
        >
          <Menu className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-text-primary">
            {t("header.pageTitle")}
          </h1>
          <p className="truncate text-xs text-text-muted">
            {t("header.pageContext")}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden max-w-md flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-left text-sm text-text-muted transition hover:border-border hover:text-text-secondary md:flex"
        >
          <Search className="size-4 shrink-0" />
          <span className="truncate">{t("header.searchPlaceholder")}</span>
          <kbd className="ml-auto hidden rounded border border-border bg-surface-elevated px-1.5 py-0.5 text-[10px] font-mono text-text-muted lg:inline">
            {t("header.searchShortcut")}
          </kbd>
        </button>

        <div className="flex items-center gap-1" ref={notifRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setLangOpen(!langOpen);
                setNotifOpen(false);
                setUserOpen(false);
              }}
              className="inline-flex size-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface hover:text-text-primary"
              aria-label={t("language.label")}
            >
              <Globe className="size-[18px]" />
            </button>
            {langOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-border bg-surface p-1 shadow-lg"
                role="menu"
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    role="menuitem"
                    className={cn(
                      "flex w-full rounded-md px-3 py-2 text-left text-sm",
                      i18n.language === l.code
                        ? "bg-accent-muted text-accent"
                        : "text-text-secondary hover:bg-surface-elevated",
                    )}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setLangOpen(false);
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex size-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface hover:text-text-primary"
            aria-label={t("theme.toggle")}
          >
            {theme === "light" ? (
              <Moon className="size-[18px]" />
            ) : (
              <Sun className="size-[18px]" />
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotifOpen(!notifOpen);
                setLangOpen(false);
                setUserOpen(false);
              }}
              className="relative inline-flex size-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface hover:text-text-primary"
              aria-label={t("header.notifications")}
            >
              <Bell className="size-[18px]" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-error" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-lg border border-border bg-surface p-3 shadow-lg">
                <p className="mb-2 text-sm font-semibold">
                  {t("notifications.title")}
                </p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="rounded-md bg-warning-muted/50 px-2 py-1.5">
                    {t("notifications.item1")}
                  </li>
                  <li className="rounded-md bg-surface-elevated px-2 py-1.5">
                    {t("notifications.item2")}
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setUserOpen(!userOpen);
                setNotifOpen(false);
                setLangOpen(false);
              }}
              className="inline-flex items-center gap-1 rounded-lg py-1 pl-1 pr-2 text-text-secondary transition hover:bg-surface hover:text-text-primary"
              aria-label={t("header.profile")}
            >
              <span
                className="flex size-8 items-center justify-center rounded-full bg-accent-muted text-xs font-semibold text-accent"
              >
                AR
              </span>
              <ChevronDown className="size-4 hidden sm:block" />
            </button>
            {userOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-lg border border-border bg-surface p-2 shadow-lg">
                <p className="px-2 py-1 text-sm font-medium text-text-primary">
                  {t("user.name")}
                </p>
                <p className="px-2 pb-2 text-xs text-text-muted">
                  {t("user.role")}
                </p>
                <div className="border-t border-border-subtle pt-1 text-sm text-text-secondary">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 hover:bg-surface-elevated"
                  >
                    <User className="size-4" />
                    {t("header.profile")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
