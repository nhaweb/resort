CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS villas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nightly_rate_cents INTEGER NOT NULL CHECK (nightly_rate_cents > 0),
  max_guests INTEGER NOT NULL DEFAULT 2 CHECK (max_guests > 0),
  currency TEXT NOT NULL DEFAULT 'eur',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  villa_id TEXT NOT NULL REFERENCES villas (id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT inventory_blocks_valid_range CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS inventory_blocks_villa_range_idx
  ON inventory_blocks (villa_id, start_date, end_date);

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  villa_id TEXT NOT NULL REFERENCES villas (id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  status TEXT NOT NULL CHECK (
    status IN ('draft', 'held', 'paid', 'expired', 'failed', 'cancelled')
  ),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'eur',
  nights INTEGER NOT NULL CHECK (nights > 0),
  hold_expires_at TIMESTAMPTZ,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reservations_valid_range CHECK (check_out > check_in)
);

CREATE INDEX IF NOT EXISTS reservations_villa_dates_idx
  ON reservations (villa_id, check_in, check_out);

CREATE INDEX IF NOT EXISTS reservations_status_idx
  ON reservations (status);

ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_no_overlap;
ALTER TABLE reservations
  ADD CONSTRAINT reservations_no_overlap
  EXCLUDE USING gist (
    villa_id WITH =,
    daterange(check_in, check_out, '[)') WITH &&
  )
  WHERE (status IN ('held', 'paid'));

CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  reservation_id UUID REFERENCES reservations (id),
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
