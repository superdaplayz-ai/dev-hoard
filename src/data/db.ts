import Dexie, { Table } from 'dexie';

export type CodeBlock = {
  id: string;
  language: string;
  code: string;
};

export type SnippetVersion = {
  id: string;
  timestamp: number; // epoch ms
  title: string;
  codeBlocks: CodeBlock[];
  description: string; // markdown
  tags: string[];
};

export type Snippet = {
  id: string;
  title: string;
  codeBlocks: CodeBlock[];
  description: string;
  tags: string[];
  language: string[]; // derived from codeBlocks
  favorite: boolean;
  project?: string;
  createdAt: number;
  updatedAt: number;
  order: number;
  versions: SnippetVersion[];
};

export class SnippetDB extends Dexie {
  snippets!: Table<Snippet, string>;

  constructor() {
    super('snippetdb');
    this.version(1).stores({
      // &id = primary key (unique), indexes on fields below for queries
      snippets: '&id, title, favorite, createdAt, updatedAt, order, *tags, *language'
    });
  }
}

export const db = new SnippetDB();
