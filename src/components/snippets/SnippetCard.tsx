import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Copy, Edit, Trash2, Star, History } from 'lucide-react';
import { Snippet } from '@/data/db';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export function SnippetCard({
  snippet,
  onEdit,
  onDelete,
  onHistory,
  onToggleFavorite,
}: {
  snippet: Snippet;
  onEdit: () => void;
  onDelete: () => void;
  onHistory: () => void;
  onToggleFavorite: () => void;
}) {
  const { toast } = useToast();

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: 'Kopiert', description: 'Kode kopiert til utklippstavlen.' });
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow animate-enter">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{snippet.title}</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant={snippet.favorite ? 'secondary' : 'ghost'} size="icon" onClick={onToggleFavorite} aria-label="Favoritt">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onHistory} aria-label="Versjonshistorikk">
            <History className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Rediger">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Slett">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {snippet.tags.map((t) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
        </div>

        {snippet.codeBlocks.map((cb) => (
          <div key={cb.id} className="rounded-md border bg-card">
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">{cb.language}</span>
              <Button size="sm" variant="outline" className="gap-2" onClick={() => copyText(cb.code)}>
                <Copy className="h-3 w-3" /> Kopier
              </Button>
            </div>
            <div className="p-3">
              <pre className="font-mono text-sm overflow-auto"><code>{cb.code}</code></pre>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <div>
          Lagt til {format(snippet.createdAt, 'yyyy-MM-dd HH:mm')} • Sist endret {format(snippet.updatedAt, 'yyyy-MM-dd HH:mm')}
        </div>
      </CardFooter>
    </Card>
  );
}
