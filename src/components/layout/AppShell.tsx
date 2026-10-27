import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { GlobalSearchModal } from "@/components/search/GlobalSearchModal";
import type { FiscalDocument } from "@/types/documents";

export function AppShell({
  children,
  onSelectFromSearch,
}: {
  children: React.ReactNode;
  onSelectFromSearch: (doc: FiscalDocument) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMobileNav={() => setMobileOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLanguageChange={(lng) => void i18n.changeLanguage(lng)}
        />
        <main className="ff-canvas flex-1 overflow-x-hidden">{children}</main>
      </div>
      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(doc) => {
          onSelectFromSearch(doc);
          setSearchOpen(false);
        }}
      />
    </div>
  );
}
