-- Create snippets table
CREATE TABLE public.snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  language TEXT[] NOT NULL DEFAULT '{}',
  favorite BOOLEAN NOT NULL DEFAULT false,
  project TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create code_blocks table
CREATE TABLE public.code_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snippet_id UUID NOT NULL REFERENCES public.snippets(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Create snippet_versions table for version history
CREATE TABLE public.snippet_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snippet_id UUID NOT NULL REFERENCES public.snippets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create version_code_blocks table
CREATE TABLE public.version_code_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version_id UUID NOT NULL REFERENCES public.snippet_versions(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.version_code_blocks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required for now)
CREATE POLICY "Allow all access to snippets" ON public.snippets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to code_blocks" ON public.code_blocks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to snippet_versions" ON public.snippet_versions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to version_code_blocks" ON public.version_code_blocks FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_snippets_updated_at
  BEFORE UPDATE ON public.snippets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_snippets_created_at ON public.snippets(created_at);
CREATE INDEX idx_snippets_updated_at ON public.snippets(updated_at);
CREATE INDEX idx_snippets_order ON public.snippets(order_index);
CREATE INDEX idx_snippets_favorite ON public.snippets(favorite);
CREATE INDEX idx_snippets_tags ON public.snippets USING GIN(tags);
CREATE INDEX idx_snippets_language ON public.snippets USING GIN(language);
CREATE INDEX idx_code_blocks_snippet_id ON public.code_blocks(snippet_id);
CREATE INDEX idx_version_code_blocks_version_id ON public.version_code_blocks(version_id);