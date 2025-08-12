import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Snippet, SnippetVersion } from '@/data/db';
import { format } from 'date-fns';

export function HistoryDrawer({ open, onOpenChange, versions, onRestore }:{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  versions: SnippetVersion[];
  onRestore: (version: SnippetVersion) => void;
}){
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Versjonshistorikk</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
          {versions.length === 0 && (
            <p className="text-sm text-muted-foreground">Ingen versjoner enda.</p>
          )}
          {versions.slice().reverse().map(v => (
            <div key={v.id} className="rounded-md border p-3 flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium">{v.title}</div>
                <div className="text-muted-foreground">{format(v.timestamp, 'yyyy-MM-dd HH:mm')}</div>
              </div>
              <Button variant="secondary" onClick={() => onRestore(v)}>Gjenopprett</Button>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
