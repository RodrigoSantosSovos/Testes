import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { OverviewPage } from "@/pages/OverviewPage";
import type { FiscalDocument } from "@/types/documents";

export default function App() {
  const [searchSelection, setSearchSelection] = useState<FiscalDocument | null>(
    null,
  );

  return (
    <AppShell
      onSelectFromSearch={(doc) => setSearchSelection(doc)}
    >
      <OverviewPage
        externalSelect={searchSelection}
        onExternalSelectHandled={() => setSearchSelection(null)}
      />
    </AppShell>
  );
}
