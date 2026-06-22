-- ═══════════════════════════════════════════════════════════════
--  Michu07 Luxury Watches — Supabase Database Schema
--  Run this entire file in the Supabase SQL editor
-- ═══════════════════════════════════════════════════════════════

-- ─── Extensions ─────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ──────────────────────────────────────────────────────
CREATE TYPE watch_condition   AS ENUM ('new', 'excellent', 'good', 'fair');
CREATE TYPE watch_status      AS ENUM ('active', 'sold', 'reserved', 'waitlist');
CREATE TYPE movement_type     AS ENUM ('automatic', 'manual', 'quartz', 'solar', 'kinetic');
CREATE TYPE order_status      AS ENUM ('pending','confirmed','processing','shipped','delivered','cancelled','refunded');
CREATE TYPE payment_method    AS ENUM ('card', 'mpesa');
CREATE TYPE user_role         AS ENUM ('customer', 'admin', 'super_admin');
CREATE TYPE appraisal_status  AS ENUM ('pending','reviewing','valued','approved','rejected');
CREATE TYPE campaign_status   AS ENUM ('draft','active','paused','ended');

-- ─── Users ──────────────────────────────────────────────────────
CREATE TABLE users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL UNIQUE,
  full_name    TEXT,
  avatar_url   TEXT,
  role         user_role NOT NULL DEFAULT 'customer',
  phone        TEXT,
  otp_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
  is_banned    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Must create is_admin() before the policy that references it,
-- but after the users table exists
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id   = auth.uid()
    AND   role IN ('admin', 'super_admin')
    AND   is_banned = FALSE
  );
$$;

-- ─── RLS ────────────────────────────────────────────────────────

CREATE POLICY "users_read_own"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "users_insert_own"
  ON users FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "admin_all_users"
  ON users FOR ALL
  USING (is_admin());

-- Trigger function: owned by postgres so it runs with
-- superuser privileges and bypasses RLS entirely
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO users (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), NEW.email),
    NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'role', '')::user_role,
      'customer'
    )
  );
  RETURN NEW;
EXCEPTION WHEN others THEN
  -- Log the error but don't block auth user creation
  RAISE WARNING 'handle_new_user failed for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Transfer ownership to postgres role (bypasses RLS)
ALTER FUNCTION handle_new_user() OWNER TO postgres;

-- ─── Triggers ───────────────────────────────────────────────────
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Auto-update updated_at ──────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Watches ────────────────────────────────────────────────────
CREATE TABLE watches (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT NOT NULL,
  brand                 TEXT NOT NULL,
  model                 TEXT NOT NULL,
  reference_number      TEXT NOT NULL,
  serial_number         TEXT NOT NULL UNIQUE,   -- ACID: unique serial
  price_cents           BIGINT NOT NULL CHECK (price_cents > 0),
  original_price_cents  BIGINT,
  currency              TEXT NOT NULL DEFAULT 'KES',
  condition             watch_condition NOT NULL DEFAULT 'new',
  status                watch_status NOT NULL DEFAULT 'active',
  movement              movement_type NOT NULL,
  case_material         TEXT NOT NULL,
  strap_material        TEXT NOT NULL,
  case_diameter_mm      NUMERIC(5,2),
  water_resistance_m    INTEGER,
  power_reserve_hours   INTEGER,
  year                  INTEGER NOT NULL,
  description           TEXT,
  features              TEXT[] NOT NULL DEFAULT '{}',
  images                TEXT[] NOT NULL DEFAULT '{}',
  video_url             TEXT,
  certificate_url       TEXT,
  stock_count           INTEGER NOT NULL DEFAULT 1 CHECK (stock_count >= 0),
  is_featured           BOOLEAN NOT NULL DEFAULT FALSE,
  is_limited            BOOLEAN NOT NULL DEFAULT FALSE,
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  created_by            UUID REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast filtering
CREATE INDEX idx_watches_brand    ON watches(brand);
CREATE INDEX idx_watches_status   ON watches(status);
CREATE INDEX idx_watches_movement ON watches(movement);
CREATE INDEX idx_watches_material ON watches(case_material);
CREATE INDEX idx_watches_featured ON watches(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_watches_search   ON watches USING gin(to_tsvector('english', name || ' ' || brand || ' ' || model || ' ' || reference_number));

-- ─── Orders ─────────────────────────────────────────────────────
CREATE TABLE orders (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_email        TEXT,
  status             order_status NOT NULL DEFAULT 'pending',
  subtotal_cents     BIGINT NOT NULL DEFAULT 0,
  shipping_cents     BIGINT NOT NULL DEFAULT 0,
  tax_cents          BIGINT NOT NULL DEFAULT 0,
  total_cents        BIGINT NOT NULL DEFAULT 0,
  payment_method     payment_method NOT NULL,
  payment_intent_id  TEXT,
  shipping_address   JSONB NOT NULL DEFAULT '{}',
  tracking_number    TEXT,
  tracking_url       TEXT,
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status  ON orders(status);

-- ─── Order Items ─────────────────────────────────────────────────
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  watch_id    UUID NOT NULL REFERENCES watches(id),
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price_cents BIGINT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Prevent duplicate serial purchase: lock watch row on order creation
-- (enforced via app-level SELECT ... FOR UPDATE + transaction)

-- ─── Wishlist ────────────────────────────────────────────────────
CREATE TABLE wishlist (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  watch_id          UUID NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  price_alert_cents BIGINT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, watch_id)
);

CREATE INDEX idx_wishlist_user_id  ON wishlist(user_id);
CREATE INDEX idx_wishlist_watch_id ON wishlist(watch_id);

-- ─── Waitlist ────────────────────────────────────────────────────
CREATE TABLE waitlist (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  email      TEXT NOT NULL,
  watch_id   UUID NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  position   INTEGER NOT NULL DEFAULT 0,
  notified   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email, watch_id)
);

CREATE INDEX idx_waitlist_watch_id ON waitlist(watch_id);

-- Auto-assign position
CREATE OR REPLACE FUNCTION assign_waitlist_position()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.position := (
    SELECT COALESCE(MAX(position), 0) + 1
    FROM waitlist WHERE watch_id = NEW.watch_id
  );
  RETURN NEW;
END;
$$;
CREATE TRIGGER before_waitlist_insert
  BEFORE INSERT ON waitlist
  FOR EACH ROW EXECUTE FUNCTION assign_waitlist_position();

-- ─── Certificates ────────────────────────────────────────────────
CREATE TABLE certificates (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  order_id           UUID NOT NULL REFERENCES orders(id),
  watch_id           UUID NOT NULL REFERENCES watches(id),
  certificate_number TEXT NOT NULL UNIQUE,
  issued_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_url           TEXT NOT NULL
);

CREATE INDEX idx_certificates_user_id ON certificates(user_id);

-- ─── Appraisals ──────────────────────────────────────────────────
CREATE TABLE appraisals (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand             TEXT NOT NULL,
  model             TEXT NOT NULL,
  reference_number  TEXT,
  serial_number     TEXT,
  year              INTEGER,
  condition         watch_condition NOT NULL,
  description       TEXT,
  images            TEXT[] NOT NULL DEFAULT '{}',
  asking_price_cents BIGINT,
  offer_price_cents  BIGINT,
  status            appraisal_status NOT NULL DEFAULT 'pending',
  admin_notes       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Campaigns ───────────────────────────────────────────────────
CREATE TABLE campaigns (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  description      TEXT,
  promo_code       TEXT UNIQUE,
  discount_percent INTEGER CHECK (discount_percent BETWEEN 0 AND 100),
  discount_cents   BIGINT,
  status           campaign_status NOT NULL DEFAULT 'draft',
  starts_at        TIMESTAMPTZ NOT NULL,
  ends_at          TIMESTAMPTZ NOT NULL,
  target_brands    TEXT[] NOT NULL DEFAULT '{}',
  created_by       UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Audit / Event Log ───────────────────────────────────────────
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity      TEXT,
  entity_id   UUID,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user_id   ON audit_logs(user_id);
CREATE INDEX idx_audit_entity    ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_created   ON audit_logs(created_at DESC);

-- Immutable: prevent updates/deletes on audit_logs
CREATE RULE no_update_audit AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
CREATE RULE no_delete_audit AS ON DELETE TO audit_logs DO INSTEAD NOTHING;

-- ─── Analytics Events ─────────────────────────────────────────────
CREATE TABLE analytics_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id  TEXT,
  event       TEXT NOT NULL,
  properties  JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_event   ON analytics_events(event);
CREATE INDEX idx_analytics_user    ON analytics_events(user_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- ─── Updated-at trigger ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER touch_watches   BEFORE UPDATE ON watches   FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER touch_orders    BEFORE UPDATE ON orders    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER touch_users     BEFORE UPDATE ON users     FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER touch_appraisals BEFORE UPDATE ON appraisals FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ═══════════════════════════════════════════════════════════════
--  Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE watches       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist      ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist      ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisals    ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns     ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs    ENABLE ROW LEVEL SECURITY;

-- Helper: is the caller an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
    AND is_banned = FALSE
  );
$$;


-- ── Watches RLS ─────────────────────────────────────────────────
CREATE POLICY "watches_read_all"  ON watches FOR SELECT USING (TRUE);
CREATE POLICY "admin_write_watches" ON watches FOR ALL  USING (is_admin());

-- ── Orders RLS ──────────────────────────────────────────────────
CREATE POLICY "orders_read_own"   ON orders FOR SELECT USING (user_id = auth.uid() OR guest_email = (SELECT email FROM users WHERE id = auth.uid()));
CREATE POLICY "orders_insert_any" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "admin_all_orders"  ON orders FOR ALL    USING (is_admin());

-- ── Order Items RLS ─────────────────────────────────────────────
CREATE POLICY "order_items_read_own" ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));
CREATE POLICY "admin_all_order_items" ON order_items FOR ALL USING (is_admin());

-- ── Wishlist RLS ─────────────────────────────────────────────────
CREATE POLICY "wishlist_own" ON wishlist FOR ALL USING (user_id = auth.uid());
CREATE POLICY "admin_wishlist" ON wishlist FOR SELECT USING (is_admin());

-- ── Waitlist RLS ─────────────────────────────────────────────────
CREATE POLICY "waitlist_read_own" ON waitlist FOR SELECT USING (user_id = auth.uid() OR email = (SELECT email FROM users WHERE id = auth.uid()));
CREATE POLICY "waitlist_insert"   ON waitlist FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "admin_waitlist"    ON waitlist FOR ALL   USING (is_admin());

-- ── Certificates RLS — vault isolation ──────────────────────────
CREATE POLICY "certs_read_own"  ON certificates FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "admin_all_certs" ON certificates FOR ALL  USING (is_admin());

-- ── Appraisals RLS ───────────────────────────────────────────────
CREATE POLICY "appraisals_own"   ON appraisals FOR ALL    USING (user_id = auth.uid());
CREATE POLICY "admin_appraisals" ON appraisals FOR ALL    USING (is_admin());

-- ── Campaigns RLS ────────────────────────────────────────────────
CREATE POLICY "campaigns_public_read"  ON campaigns FOR SELECT USING (status = 'active');
CREATE POLICY "admin_all_campaigns"    ON campaigns FOR ALL   USING (is_admin());

-- ── Audit Logs RLS ───────────────────────────────────────────────
CREATE POLICY "admin_read_audit" ON audit_logs FOR SELECT USING (is_admin());
CREATE POLICY "insert_audit"     ON audit_logs FOR INSERT WITH CHECK (TRUE);

-- ═══════════════════════════════════════════════════════════════
--  Seed: demo watches
-- ═══════════════════════════════════════════════════════════════
INSERT INTO watches (name, brand, model, reference_number, serial_number, price_cents, currency, condition, status, movement, case_material, strap_material, case_diameter_mm, water_resistance_m, power_reserve_hours, year, description, features, images, stock_count, is_featured, is_limited, tags)
VALUES
  ('Submariner Date', 'Rolex', 'Submariner', '126610LN', 'SN-ROL-001', 18000000, 'KES', 'new', 'active', 'automatic', 'Stainless Steel', 'Stainless Steel Bracelet', 41, 300, 70, 2024, 'The pinnacle of diving horology.', ARRAY['Cerachrom bezel','Triplock crown','Luminescent display'], ARRAY['https://picsum.photos/seed/rolex1/800/1000'], 2, TRUE, FALSE, ARRAY['diving','iconic']),
  ('Royal Oak 15500ST', 'Audemars Piguet', 'Royal Oak', '15500ST.OO.1220ST.01', 'SN-AP-001', 45000000, 'KES', 'new', 'active', 'automatic', 'Stainless Steel', 'Stainless Steel Bracelet', 41, 50, 60, 2023, 'The most recognisable luxury sports watch.', ARRAY['Tapisserie dial','Integrated bracelet','Calibre 4302'], ARRAY['https://picsum.photos/seed/ap1/800/1000'], 1, TRUE, TRUE, ARRAY['sports','collector']),
  ('Nautilus 5711', 'Patek Philippe', 'Nautilus', '5711/1A-014', 'SN-PP-001', 120000000, 'KES', 'excellent', 'active', 'automatic', 'Stainless Steel', 'Stainless Steel Bracelet', 40, 120, 45, 2021, 'The most coveted watch in the world.', ARRAY['Olive green dial','Calibre 26-330 SC','Graduated bezel'], ARRAY['https://picsum.photos/seed/pp1/800/1000'], 1, TRUE, TRUE, ARRAY['collector','investment','rare']);
