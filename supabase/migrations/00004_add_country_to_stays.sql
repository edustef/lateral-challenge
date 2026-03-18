-- Add country column to stays for geographic filtering
ALTER TABLE stays ADD COLUMN country TEXT NOT NULL DEFAULT 'US';

-- Backfill country codes based on existing location data
UPDATE stays SET country = CASE
  WHEN location LIKE '%, North Carolina' THEN 'US'
  WHEN location LIKE '%, Montana' THEN 'US'
  WHEN location LIKE '%, Utah' THEN 'US'
  WHEN location LIKE '%, California' THEN 'US'
  WHEN location LIKE '%, Hawaii' THEN 'US'
  WHEN location LIKE '%, Arizona' THEN 'US'
  WHEN location LIKE '%, Alaska' THEN 'US'
  WHEN location LIKE '%, Washington' THEN 'US'
  WHEN location LIKE '%, Oregon' THEN 'US'
  WHEN location LIKE '%, Colorado' THEN 'US'
  WHEN location LIKE '%, New York' THEN 'US'
  WHEN location LIKE '%, Wyoming' THEN 'US'
  WHEN location LIKE '%, Switzerland' THEN 'CH'
  WHEN location LIKE '%, Costa Rica' THEN 'CR'
  WHEN location LIKE '%, Norway' THEN 'NO'
  WHEN location LIKE '%, Morocco' THEN 'MA'
  WHEN location LIKE '%, Japan' THEN 'JP'
  WHEN location LIKE '%, Bali' THEN 'ID'
  WHEN location LIKE '%, Australia' THEN 'AU'
  WHEN location LIKE '%, France' THEN 'FR'
  WHEN location LIKE '%, Italy' THEN 'IT'
  WHEN location LIKE '%, Portugal' THEN 'PT'
  WHEN location LIKE '%, Turkey' THEN 'TR'
  WHEN location LIKE '%, Greece' THEN 'GR'
  WHEN location LIKE '%, Cuba' THEN 'CU'
  WHEN location LIKE '%, England' THEN 'GB'
  WHEN location LIKE '%, Scotland' THEN 'GB'
  WHEN location LIKE '%, Ireland' THEN 'IE'
  WHEN location LIKE '%, Czech Republic' THEN 'CZ'
  WHEN location LIKE '%, Mexico' THEN 'MX'
  WHEN location LIKE '%, Argentina' THEN 'AR'
  WHEN location LIKE '%, Kenya' THEN 'KE'
  WHEN location LIKE '%, Mongolia' THEN 'MN'
  WHEN location LIKE '%, Canada' THEN 'CA'
  ELSE 'US'
END;

-- Remove the default now that data is backfilled
ALTER TABLE stays ALTER COLUMN country DROP DEFAULT;

-- Index for fast country lookups
CREATE INDEX idx_stays_country ON stays(country);
