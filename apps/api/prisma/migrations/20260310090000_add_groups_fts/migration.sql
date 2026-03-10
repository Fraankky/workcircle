-- Full-text search vector for groups
ALTER TABLE groups
  ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
      to_tsvector('simple',
        coalesce(name, '') || ' ' || coalesce(description, '')
      )
    ) STORED;

CREATE INDEX IF NOT EXISTS groups_search_idx ON groups USING GIN(search_vector);
