import { useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Upload, Download, Plus, Star, Filter } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useSnippetsStore } from '@/store/snippetsStore';
import { useToast } from '@/hooks/use-toast';

export function AppHeader({ onAdd }: { onAdd: () => void }) {
  const { toast } = useToast();
  const { filters, setFilters, exportJSON, importJSON } = useSnippetsStore();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onExport = () => {
    const data = exportJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snippets-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Eksportert', description: 'Snippets eksportert som JSON.' });
  };

  const onImportClick = () => fileRef.current?.click();

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await importJSON(text);
    toast({ title: 'Importert', description: 'Snippets importert.' });
  };

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center gap-3">
        <SidebarTrigger className="mr-1" />
        <div className="flex-1 flex items-center gap-3">
          <Input
            placeholder="Søk i kode, beskrivelser og tags..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="max-w-xl"
          />
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant={filters.favoritesOnly ? 'secondary' : 'ghost'}
            onClick={() => setFilters({ favoritesOnly: !filters.favoritesOnly })}
            aria-pressed={filters.favoritesOnly}
            className="gap-2"
          >
            <Star className="h-4 w-4" /> Favoritter
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImport} />
          <Button variant="outline" onClick={onImportClick} className="gap-2"><Upload className="h-4 w-4" /> Import</Button>
          <Button variant="outline" onClick={onExport} className="gap-2"><Download className="h-4 w-4" /> Eksport</Button>
          <ThemeToggle />
          <Button onClick={onAdd} className="gap-2"><Plus className="h-4 w-4" /> Ny snippet</Button>
        </div>
      </div>
    </header>
  );
}
