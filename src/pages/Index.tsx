import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSnippetsStore } from "@/store/snippetsStore";
import { SnippetList } from "@/components/snippets/SnippetList";
import { SnippetEditor, type EditorValue } from "@/components/snippets/SnippetEditor";
import { HistoryDrawer } from "@/components/snippets/HistoryDrawer";
import { Snippet, SnippetVersion } from "@/data/db";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const {
    load,
    snippets,
    filters,
    setFilters,
    addSnippet,
    updateSnippet,
    deleteSnippet,
  } = useSnippetsStore();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Snippet | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyFor, setHistoryFor] = useState<Snippet | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const s = (snippets || []).slice();
    const q = filters.search.trim().toLowerCase();
    return s.filter((item) => {
      if (filters.favoritesOnly && !item.favorite) return false;
      if (filters.languages.length) {
        const hasLang = item.language.some((l) => filters.languages.includes(l));
        if (!hasLang) return false;
      }
      if (filters.tags.length) {
        const hasAll = filters.tags.every((t) => item.tags.includes(t));
        if (!hasAll) return false;
      }
      if (q) {
        const hay = [
          item.title,
          item.description,
          item.tags.join(" "),
          item.codeBlocks.map((cb) => cb.code).join("\n\n"),
        ]
          .join("\n\n")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [snippets, filters]);

  const onAdd = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const onSave = async (val: EditorValue) => {
    if (editing) {
      await updateSnippet(editing.id, {
        title: val.title,
        description: val.description,
        tags: val.tags,
        codeBlocks: val.codeBlocks,
      });
      toast({ title: "Oppdatert", description: "Snippet oppdatert." });
    } else {
      await addSnippet({
        title: val.title,
        description: val.description,
        tags: val.tags,
        project: val.project,
        favorite: false,
        codeBlocks: val.codeBlocks,
        language: val.codeBlocks.map((cb) => cb.language),
        order: snippets.length,
      });
      toast({ title: "Lagt til", description: "Ny snippet opprettet." });
    }
    setEditorOpen(false);
    setEditing(null);
  };

  const onEdit = (s: Snippet) => {
    setEditing(s);
    setEditorOpen(true);
  };

  const onDelete = async (s: Snippet) => {
    if (confirm(`Slette "${s.title}"?`)) {
      await deleteSnippet(s.id);
      toast({ title: "Slettet" });
    }
  };

  const onHistory = (s: Snippet) => {
    setHistoryFor(s);
    setHistoryOpen(true);
  };

  const onRestoreVersion = async (v: SnippetVersion) => {
    if (!historyFor) return;
    await updateSnippet(historyFor.id, {
      title: v.title,
      description: v.description,
      tags: v.tags,
      codeBlocks: v.codeBlocks,
    });
    toast({ title: "Gjenopprettet", description: "Versjon gjenopprettet." });
    setHistoryOpen(false);
  };

  const hasActiveFilters =
    filters.search.trim() || filters.languages.length || filters.tags.length || filters.favoritesOnly;

  return (
    <SidebarProvider>
      <Helmet>
        <title>Kodehuskeliste – Snippet Manager</title>
        <meta name="description" content="Organiser kodeeksempler med søk, tags, versjonshistorikk, markdown og eksport/import." />
      </Helmet>

      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader onAdd={onAdd} />
          <main className="container mx-auto px-4 py-6 space-y-4">
            <header>
              <h1 className="text-2xl font-semibold">Dine kodeeksempler</h1>
              <p className="text-muted-foreground">Legg til, søk og organiser snippets på tvers av språk.</p>
            </header>

            {hasActiveFilters ? (
              <div className="flex flex-wrap items-center gap-2">
                {filters.favoritesOnly ? <Badge variant="secondary">Favoritter</Badge> : null}
                {filters.languages.map((l) => (
                  <Badge key={l} variant="secondary">{l}</Badge>
                ))}
                {filters.tags.map((t) => (
                  <Badge key={t} variant="secondary">#{t}</Badge>
                ))}
                <Button variant="ghost" onClick={() => setFilters({ search: "", languages: [], tags: [], favoritesOnly: false })}>
                  Nullstill filtre
                </Button>
              </div>
            ) : null}

            {filtered.length === 0 ? (
              <div className="rounded-md border p-8 text-center text-muted-foreground">
                <p>Ingen snippets enda. Klikk «Ny snippet» for å komme i gang.</p>
              </div>
            ) : (
              <SnippetList snippets={filtered} onEdit={onEdit} onDelete={onDelete} onHistory={onHistory} />
            )}
          </main>
        </div>
      </div>

      <SnippetEditor open={editorOpen} onOpenChange={setEditorOpen} initial={editing} onSave={onSave} />
      <HistoryDrawer open={historyOpen} onOpenChange={setHistoryOpen} versions={historyFor?.versions ?? []} onRestore={onRestoreVersion} />
    </SidebarProvider>
  );
};

export default Index;
