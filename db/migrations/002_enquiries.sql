CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  villa_id TEXT REFERENCES villas (id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  message TEXT NOT NULL,
  check_in DATE,
  check_out DATE,
  locale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT enquiries_valid_range CHECK (
    check_in IS NULL OR check_out IS NULL OR check_out > check_in
  )
);

CREATE INDEX IF NOT EXISTS enquiries_created_idx
  ON enquiries (created_at DESC);
