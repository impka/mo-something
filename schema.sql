CREATE TABLE movids (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  resolution TEXT NOT NULL,
  generated_preview_url TEXT,
  status TEXT NOT NULL,
  tags TEXT[], -- Postgres array of strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

