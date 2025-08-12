import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LANGUAGES } from '@/data/languages';
import { CodeBlock, Snippet } from '@/data/db';

export type EditorValue = {
  title: string;
  description: string;
  tags: string[];
  project?: string;
  codeBlocks: CodeBlock[];
};

const emptyBlock = (): CodeBlock => ({ id: crypto.randomUUID(), language: 'JavaScript', code: '' });

export function SnippetEditor({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Snippet | null;
  onSave: (value: EditorValue) => void;
}) {
  const [value, setValue] = useState<EditorValue>({ title: '', description: '', tags: [], project: '', codeBlocks: [emptyBlock()] });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initial) {
      setValue({ title: initial.title, description: initial.description, tags: initial.tags, project: initial.project, codeBlocks: initial.codeBlocks });
    } else {
      setValue({ title: '', description: '', tags: [], project: '', codeBlocks: [emptyBlock()] });
    }
  }, [initial, open]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!value.tags.includes(t)) setValue(v => ({ ...v, tags: [...v.tags, t] }));
    setTagInput('');
  };

  const removeTag = (t: string) => setValue(v => ({ ...v, tags: v.tags.filter(x => x !== t) }));

  const addBlock = () => setValue(v => ({ ...v, codeBlocks: [...v.codeBlocks, emptyBlock()] }));
  const removeBlock = (id: string) => setValue(v => ({ ...v, codeBlocks: v.codeBlocks.filter(cb => cb.id !== id) }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initial ? 'Rediger snippet' : 'Ny snippet'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Tittel</Label>
            <Input id="title" value={value.title} onChange={(e) => setValue(v => ({ ...v, title: e.target.value }))} />
          </div>

          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input placeholder="legg til tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag()} />
              <Button variant="outline" onClick={addTag}>Legg til</Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {value.tags.map(t => (
                <Badge key={t} variant="secondary" className="cursor-pointer" onClick={() => removeTag(t)}>{t} ×</Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Kodeblokker</Label>
            <div className="space-y-4">
              {value.codeBlocks.map((cb, idx) => (
                <div key={cb.id} className="rounded-md border p-3">
                  <div className="flex gap-2 items-center mb-2">
                    <Select value={cb.language} onValueChange={(val) => setValue(v => ({ ...v, codeBlocks: v.codeBlocks.map(x => x.id === cb.id ? { ...x, language: val } : x) }))}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Språk" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map(l => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="destructive" size="sm" onClick={() => removeBlock(cb.id)} disabled={value.codeBlocks.length === 1}>Fjern</Button>
                  </div>
                  <Textarea
                    value={cb.code}
                    onChange={(e) => setValue(v => ({ ...v, codeBlocks: v.codeBlocks.map(x => x.id === cb.id ? { ...x, code: e.target.value } : x) }))}
                    rows={6}
                    className="font-mono"
                    placeholder={`Skriv ${cb.language} kode her...`}
                  />
                </div>
              ))}
            </div>
            <Button variant="secondary" onClick={addBlock}>+ Legg til kodeblokk</Button>
          </div>

          <div className="grid gap-2">
            <Label>Notater (Markdown)</Label>
            <Textarea rows={6} value={value.description} onChange={(e) => setValue(v => ({ ...v, description: e.target.value }))} placeholder="Skriv notater, tips eller forklaring..." />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onSave(value)} disabled={!value.title.trim()}>Lagre</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
