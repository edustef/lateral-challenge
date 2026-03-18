-- ============================================================
-- BLOCKED DATES (owner-managed unavailable date ranges)
-- ============================================================
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stay_id UUID NOT NULL REFERENCES stays(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL DEFAULT 'manual_block',
  created_at TIMESTAMPTZ DEFAULT now(),
  CHECK (end_date > start_date),
  EXCLUDE USING gist (stay_id WITH =, daterange(start_date, end_date) WITH &&)
);

ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Anyone can view blocked dates (needed for availability display)
CREATE POLICY "Anyone can view blocked dates"
  ON blocked_dates FOR SELECT USING (true);

-- ============================================================
-- FUNCTION: get_unavailable_dates
-- Returns all unavailable date ranges for a stay (bookings + blocks).
-- SECURITY DEFINER bypasses booking RLS to expose only date ranges.
-- ============================================================
CREATE OR REPLACE FUNCTION get_unavailable_dates(p_stay_id UUID)
RETURNS TABLE(start_date DATE, end_date DATE) AS $$
  SELECT check_in, check_out FROM bookings
    WHERE stay_id = p_stay_id AND status = 'confirmed' AND check_out >= CURRENT_DATE
  UNION ALL
  SELECT bd.start_date, bd.end_date FROM blocked_dates bd
    WHERE bd.stay_id = p_stay_id AND bd.end_date >= CURRENT_DATE
$$ LANGUAGE sql SECURITY DEFINER STABLE;
