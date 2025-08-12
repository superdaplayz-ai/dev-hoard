import { create } from 'zustand';
import { db, Snippet, CodeBlock, SnippetVersion } from '@/data/db';

export type Filters = {
  search: string;
  languages: string[];
  tags: string[];
  favoritesOnly: boolean;
};

type State = {
  loading: boolean;
  snippets: Snippet[];
  filters: Filters;
  load: () => Promise<void>;
  addSnippet: (input: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'versions'>) => Promise<Snippet>;
  updateSnippet: (id: string, updates: Partial<Snippet>) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  reorder: (orderedIds: string[]) => Promise<void>;
  importJSON: (json: string) => Promise<void>;
  exportJSON: () => string;
  setFilters: (partial: Partial<Filters>) => void;
  clearFilters: () => void;
  allTags: () => string[];
  allLanguages: () => string[];
};

const now = () => Date.now();

export const useSnippetsStore = create<State>((set, get) => ({
  loading: true,
  snippets: [],
  filters: { search: '', languages: [], tags: [], favoritesOnly: false },

  load: async () => {
    const items = await db.snippets.toArray();
    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || b.updatedAt - a.updatedAt);
    set({ snippets: items, loading: false });
  },

  addSnippet: async (input) => {
    const id = crypto.randomUUID();
    const base: Snippet = {
      ...input,
      id,
      language: input.codeBlocks.map(cb => cb.language),
      createdAt: now(),
      updatedAt: now(),
      versions: [],
    } as Snippet;

    // order at end
    const current = get().snippets;
    base.order = current.length;

    await db.snippets.put(base);
    set({ snippets: [...current, base] });
    return base;
  },

  updateSnippet: async (id, updates) => {
    const current = get().snippets;
    const idx = current.findIndex(s => s.id === id);
    if (idx === -1) return;
    const prev = current[idx];

    // push previous state to versions
    const version: SnippetVersion = {
      id: crypto.randomUUID(),
      timestamp: now(),
      title: prev.title,
      codeBlocks: prev.codeBlocks,
      description: prev.description,
      tags: prev.tags,
    };

    const next: Snippet = {
      ...prev,
      ...updates,
      language: (updates.codeBlocks ?? prev.codeBlocks).map(cb => cb.language),
      updatedAt: now(),
      versions: [...prev.versions, version],
    };

    await db.snippets.put(next);
    const copy = [...current];
    copy[idx] = next;
    set({ snippets: copy });
  },

  deleteSnippet: async (id) => {
    await db.snippets.delete(id);
    const left = get().snippets.filter(s => s.id !== id);
    // normalize order
    left.forEach((s, i) => (s.order = i));
    await db.snippets.bulkPut(left);
    set({ snippets: left });
  },

  toggleFavorite: async (id) => {
    const s = get().snippets.find(s => s.id === id);
    if (!s) return;
    await get().updateSnippet(id, { favorite: !s.favorite });
  },

  reorder: async (orderedIds) => {
    const map = new Map(orderedIds.map((id, i) => [id, i]));
    const updated = get().snippets.map(s => ({ ...s, order: map.get(s.id) ?? s.order }));
    updated.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    await db.snippets.bulkPut(updated);
    set({ snippets: updated });
  },

  importJSON: async (json) => {
    const data = JSON.parse(json) as Snippet[];
    // basic validation
    const valid = data.filter(d => d.id && d.title && Array.isArray(d.codeBlocks));
    await db.snippets.clear();
    await db.snippets.bulkPut(valid);
    set({ snippets: valid });
  },

  exportJSON: () => {
    const data = get().snippets;
    return JSON.stringify(data, null, 2);
  },

  setFilters: (partial) => set((state) => ({ filters: { ...state.filters, ...partial } })),
  clearFilters: () => set({ filters: { search: '', languages: [], tags: [], favoritesOnly: false } }),

  allTags: () => {
    const setTags = new Set<string>();
    get().snippets.forEach(s => s.tags.forEach(t => setTags.add(t)));
    return Array.from(setTags).sort();
  },
  allLanguages: () => {
    const setLang = new Set<string>();
    get().snippets.forEach(s => s.language.forEach(l => setLang.add(l)));
    return Array.from(setLang).sort();
  },
}));
