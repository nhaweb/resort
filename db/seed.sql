INSERT INTO villas (id, name, nightly_rate_cents, max_guests, currency, active)
VALUES
  ('east-cut', 'East Cut', 48000, 2, 'eur', TRUE),
  ('shelf', 'The Shelf', 52000, 2, 'eur', TRUE),
  ('high-ledge', 'High Ledge', 45000, 2, 'eur', TRUE),
  ('low-path', 'Low Path', 49000, 2, 'eur', TRUE),
  ('dining-house', 'Dining House', 60000, 4, 'eur', TRUE),
  ('bath-house', 'Bath House', 42000, 2, 'eur', TRUE),
  ('north-cut', 'North Cut', 44000, 2, 'eur', TRUE),
  ('mid-terrace', 'Mid Terrace', 47000, 3, 'eur', TRUE),
  ('last-light', 'Last Light', 51000, 2, 'eur', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  nightly_rate_cents = EXCLUDED.nightly_rate_cents,
  max_guests = EXCLUDED.max_guests,
  currency = EXCLUDED.currency,
  active = EXCLUDED.active;
