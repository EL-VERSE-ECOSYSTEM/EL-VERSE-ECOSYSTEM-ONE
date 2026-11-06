-- Migration 20260108000000_v3_profiles_and_rag.sql
-- EL VERSE ECOSYSTEM ONE - v3.0.0 Blueprint Migration

-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Update profiles table schema to conform to Blueprint v3.0.0
-- Blueprint specification:
-- CREATE TABLE public.profiles (
--   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--   email TEXT UNIQUE NOT NULL,
--   full_name TEXT NOT NULL,
--   user_role TEXT CHECK (user_role IN ('client', 'developer', 'staff', 'admin')) DEFAULT 'client',
--   arm_access TEXT[] NOT NULL DEFAULT ARRAY['EL ACCESS']::TEXT[],
--   created_at TIMESTAMPTZ DEFAULT clock_timestamp()
-- );

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS user_role TEXT DEFAULT 'client',
  ADD COLUMN IF NOT EXISTS arm_access TEXT[] NOT NULL DEFAULT ARRAY['EL ACCESS']::TEXT[];

-- Ensure user_role check constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_role_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_user_role_check
      CHECK (user_role IN ('client', 'developer', 'staff', 'admin'));
  END IF;
END $$;

-- Enable RLS on profiles (ensured)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Blueprint RLS Policy: User profile isolation with admin/staff overrides
DROP POLICY IF EXISTS "Profile Boundary Isolation" ON public.profiles;

CREATE POLICY "Profile Boundary Isolation" ON public.profiles FOR SELECT
USING (
  auth.uid() = id OR (auth.jwt() -> 'app_metadata' ->> 'user_role') IN ('staff', 'admin')
);

-- RAG pgvector Documents table & indexes (1536-dim embeddings, BM25 text & HNSW dense search)
CREATE TABLE IF NOT EXISTS public.rag_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

ALTER TABLE public.rag_documents ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rag_documents TO authenticated;

-- HNSW dense indexing for vector similarity search
CREATE INDEX IF NOT EXISTS rag_documents_embedding_hnsw_idx
  ON public.rag_documents USING hnsw (embedding vector_cosine_ops);

-- Sparse / full text search indexing for hybrid search
CREATE INDEX IF NOT EXISTS rag_documents_content_fts_idx
  ON public.rag_documents USING gin (to_tsvector('english', content));
