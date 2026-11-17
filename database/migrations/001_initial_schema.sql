-- NIC Valsad Office Management: initial relational schema.
-- Apply only to a dedicated development database first. No live office data included.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  id SMALLSERIAL PRIMARY KEY,
  role_key TEXT NOT NULL UNIQUE CHECK (role_key IN ('administrator','data_entry','viewer')),
  label TEXT NOT NULL
);
INSERT INTO roles(role_key,label) VALUES
 ('administrator','Administrator'),('data_entry','Data Entry'),('viewer','Viewer')
ON CONFLICT (role_key) DO NOTHING;

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  role_id SMALLINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  PRIMARY KEY(user_id,role_id)
);

CREATE TABLE rfms_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_no TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  description TEXT,
  received_on DATE NOT NULL DEFAULT CURRENT_DATE,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK(priority IN ('low','normal','high','urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','in_progress','pending','resolved','closed')),
  assigned_to UUID REFERENCES app_users(id),
  created_by UUID REFERENCES app_users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX rfms_status_idx ON rfms_queries(status,received_on DESC);

CREATE TABLE rfms_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID NOT NULL REFERENCES rfms_queries(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  next_action_on DATE,
  created_by UUID REFERENCES app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  details TEXT NOT NULL,
  category TEXT,
  duration_minutes INTEGER CHECK(duration_minutes IS NULL OR duration_minutes >= 0),
  created_by UUID NOT NULL REFERENCES app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX diary_date_idx ON diary_entries(entry_date DESC);

CREATE TABLE vc_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  meeting_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  organizer TEXT,
  venue TEXT,
  purpose TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled','completed','cancelled')),
  created_by UUID REFERENCES app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE vc_meeting_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES vc_meetings(id) ON DELETE CASCADE,
  encrypted_url BYTEA NOT NULL,
  access_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE network_complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_no TEXT NOT NULL UNIQUE,
  reported_on TIMESTAMPTZ NOT NULL DEFAULT now(),
  location_label TEXT NOT NULL,
  service_type TEXT,
  issue_summary TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK(severity IN ('low','medium','high','critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','assigned','in_progress','resolved','closed')),
  assigned_to UUID REFERENCES app_users(id),
  resolved_at TIMESTAMPTZ,
  created_by UUID REFERENCES app_users(id)
);
CREATE TABLE network_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES network_complaints(id) ON DELETE CASCADE,
  update_text TEXT NOT NULL,
  updated_by UUID REFERENCES app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE seva_setu_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_name TEXT NOT NULL,
  drive_date DATE,
  location_label TEXT,
  taluka_label TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK(status IN ('planned','in_progress','completed','cancelled')),
  notes TEXT,
  created_by UUID REFERENCES app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ict_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_tag TEXT NOT NULL UNIQUE,
  asset_type TEXT NOT NULL,
  make_model TEXT,
  serial_number TEXT,
  location_label TEXT,
  assigned_to UUID REFERENCES app_users(id),
  purchase_date DATE,
  warranty_end DATE,
  asset_status TEXT NOT NULL DEFAULT 'in_use' CHECK(asset_status IN ('in_use','in_stock','under_repair','condemned','disposed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE staff_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_user_id UUID NOT NULL REFERENCES app_users(id),
  movement_type TEXT NOT NULL CHECK(movement_type IN ('tour','attendance','leave','other')),
  from_date DATE NOT NULL,
  to_date DATE,
  destination TEXT,
  purpose TEXT,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK(approval_status IN ('pending','approved','rejected')),
  created_by UUID REFERENCES app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK(to_date IS NULL OR to_date >= from_date)
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_type TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  venue TEXT,
  organizer TEXT,
  ict_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK(status IN ('planned','ongoing','completed','cancelled')),
  created_by UUID REFERENCES app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK(end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id UUID REFERENCES app_users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX audit_entity_idx ON audit_logs(entity_type,entity_id);
CREATE INDEX audit_actor_idx ON audit_logs(actor_user_id,occurred_at DESC);
