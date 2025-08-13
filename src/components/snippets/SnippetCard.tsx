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
    <div className="space-y-6">
      {/* Title and Actions */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">{snippet.title}</h2>
          {snippet.description && (
            <p className="text-muted-foreground mb-3">{snippet.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {snippet.tags.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
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
      </div>

      {/* Code Blocks */}
      <div className="space-y-4">
        {snippet.codeBlocks.map((cb) => (
          <div key={cb.id} className="border border-border rounded-lg overflow-hidden">
            {/* Code Header */}
            <div className="bg-muted/30 px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium text-primary">&lt;{cb.language}&gt;</span>
                  <span className="text-sm text-muted-foreground">
                    {cb.language.charAt(0).toUpperCase() + cb.language.slice(1)} kode
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 gap-2 bg-background" 
                  onClick={() => copyText(cb.code)}
                >
                  <Copy className="h-3 w-3" />
                  <span className="text-xs">Kopier</span>
                </Button>
              </div>
            </div>
            
            {/* Code Content */}
            <div className="bg-muted/10 p-4">
              <pre className="font-mono text-sm leading-relaxed text-foreground overflow-x-auto">
                <code>{cb.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Lagt til {format(snippet.createdAt, 'dd.MM.yyyy')} • Sist endret {format(snippet.updatedAt, 'dd.MM.yyyy')}
          </span>
        </div>
      </div>
    </div>
  );
}
