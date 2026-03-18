-- Replace single-value vibe enum with multi-value tags array
ALTER TABLE stays DROP COLUMN vibe;
ALTER TABLE stays ADD COLUMN tags text[] DEFAULT '{}';
