-- ═══════════════════════════════════════════════
-- NAGARNETRA — Database Schema + Seed Data
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- ─── CONTRACTORS TABLE ──────────────────────────
create table if not exists contractors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  license_number text unique not null,
  accountability_score decimal(4,1) default 100.0,
  total_assigned integer default 0,
  total_completed integer default 0,
  total_verified integer default 0,
  avg_completion_days decimal(4,1),
  city text default 'Nagpur',
  created_at timestamptz default now()
);

-- ─── USERS TABLE ────────────────────────────────
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  role text check (role in ('citizen', 'officer', 'contractor', 'admin')),
  ward text,
  city text default 'Nagpur',
  created_at timestamptz default now()
);

-- ─── COMPLAINTS TABLE ───────────────────────────
create table if not exists complaints (
  id uuid primary key default gen_random_uuid(),
  pothole_id uuid,
  complaint_text text,
  complaint_number text unique,
  filed_by uuid references users(id),
  status text default 'filed',
  municipality_notified boolean default false,
  created_at timestamptz default now()
);

-- ─── POTHOLES TABLE ────────────────────────────
create table if not exists potholes (
  id uuid primary key default gen_random_uuid(),
  reported_by uuid references users(id),
  latitude decimal(10,7) not null,
  longitude decimal(10,7) not null,
  address text,
  ward text,
  severity text check (severity in ('L1', 'L2', 'L3')),
  severity_score decimal(3,2),
  status text check (status in ('reported', 'acknowledged', 'in_progress', 'completed', 'verified')) default 'reported',
  photo_before_url text,
  photo_after_url text,
  photo_hash text,
  ai_confidence decimal(3,2),
  estimated_repair_cost integer,
  assigned_contractor_id uuid references contractors(id),
  complaint_id uuid references complaints(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── VERIFICATIONS TABLE ────────────────────────
create table if not exists verifications (
  id uuid primary key default gen_random_uuid(),
  pothole_id uuid references potholes(id),
  verified_by_ai boolean,
  ai_confidence decimal(3,2),
  verification_result text check (verification_result in ('approved', 'rejected', 'partial')),
  notes text,
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════

-- Seed Contractors
insert into contractors (name, license_number, accountability_score, total_assigned, total_completed, total_verified, avg_completion_days, city) values
  ('Nagpur Road Works Pvt Ltd', 'NMC-CON-001', 96.0, 45, 45, 42, 3.2, 'Nagpur'),
  ('Maharashtra Infra Solutions', 'NMC-CON-002', 89.0, 38, 36, 33, 5.1, 'Nagpur'),
  ('City Build Contractors', 'NMC-CON-003', 78.0, 30, 27, 22, 7.4, 'Nagpur'),
  ('Vidarbha Highway Services', 'NMC-CON-004', 67.0, 25, 20, 14, 11.2, 'Nagpur'),
  ('Quick Fix Roads Ltd', 'NMC-CON-005', 45.0, 20, 12, 6, 18.5, 'Nagpur');

-- Seed Demo User
insert into users (id, email, name, role, ward, city) values
  ('00000000-0000-0000-0000-000000000001', 'demo@nagarnetra.in', 'Demo Citizen', 'citizen', 'Dharampeth', 'Nagpur'),
  ('00000000-0000-0000-0000-000000000002', 'officer@nagpur.gov.in', 'Municipal Officer', 'officer', 'Sadar', 'Nagpur');

-- Seed Potholes
insert into potholes (reported_by, latitude, longitude, address, ward, severity, severity_score, status, ai_confidence, estimated_repair_cost, photo_hash) values
  ('00000000-0000-0000-0000-000000000001', 21.1520000, 79.0750000, 'Law College Square, Dharampeth', 'Dharampeth', 'L3', 0.92, 'reported', 0.92, 45000, 'a3f9c2e8b1d4f6a7c9e2b5d8f1a3c6e9'),
  ('00000000-0000-0000-0000-000000000001', 21.1485000, 79.0710000, 'Seminary Hills Road, Dharampeth', 'Dharampeth', 'L2', 0.75, 'in_progress', 0.78, 15000, 'b4e8d2c7a1f5e3b9d6c8a2e5f7b1d4a8'),
  ('00000000-0000-0000-0000-000000000001', 21.1505000, 79.0780000, 'Ambazari Road, Dharampeth', 'Dharampeth', 'L2', 0.68, 'reported', 0.72, 12000, 'c5d7e3b8a2f4d6c1e9b3a7f2d8c4e6b1'),
  ('00000000-0000-0000-0000-000000000001', 21.1460000, 79.0730000, 'Telangkhedi Garden Road, Dharampeth', 'Dharampeth', 'L1', 0.45, 'completed', 0.52, 5000, 'd6c8e4b9a3f5e7d2c1b4a8f3e9d5c7b2'),
  ('00000000-0000-0000-0000-000000000001', 21.1390000, 79.0850000, 'Sadar Main Road, near RBI Square', 'Sadar', 'L3', 0.95, 'reported', 0.95, 65000, 'e7b9d5c1a4f6e8d3c2b5a9f4e1d7c8b3'),
  ('00000000-0000-0000-0000-000000000001', 21.1375000, 79.0890000, 'Residency Road, Sadar', 'Sadar', 'L3', 0.88, 'acknowledged', 0.89, 55000, 'f8c1e6d2b5a7f9e4d3c6b1a2f8e3d9c4'),
  ('00000000-0000-0000-0000-000000000001', 21.1410000, 79.0920000, 'Central Avenue, Sadar', 'Sadar', 'L2', 0.72, 'in_progress', 0.75, 18000, 'a9d2e7c3b6f1a8e5d4c7b2a3f9e1d6c5'),
  ('00000000-0000-0000-0000-000000000001', 21.1355000, 79.0870000, 'Kingsway, Sadar', 'Sadar', 'L1', 0.42, 'verified', 0.48, 4000, 'b1e3d8c4a7f2b9e6d5c8a1f4b2e7d3c6'),
  ('00000000-0000-0000-0000-000000000001', 21.1440000, 79.0950000, 'Sitabuldi Fort Road', 'Sitabuldi', 'L3', 0.91, 'reported', 0.91, 48000, 'c2f4e9d5b8a1c7e3d6b4a9f5c1e8d2b7'),
  ('00000000-0000-0000-0000-000000000001', 21.1425000, 79.0980000, 'Variety Square, Sitabuldi', 'Sitabuldi', 'L2', 0.74, 'reported', 0.76, 14000, 'd3a5f1e6c9b2d8e4a7c3f6b1e9d5a2c8'),
  ('00000000-0000-0000-0000-000000000001', 21.1455000, 79.1010000, 'Morris College Road, Sitabuldi', 'Sitabuldi', 'L2', 0.65, 'completed', 0.69, 11000, 'e4b6d2a8c1f3e7d9b5a2c8f4e1b7d3a9'),
  ('00000000-0000-0000-0000-000000000001', 21.1470000, 79.0930000, 'Cotton Market Road, Sitabuldi', 'Sitabuldi', 'L1', 0.38, 'verified', 0.42, 3500, 'f5c7e3b9d2a4f8e1c6b3a7d5f2e8c4b1'),
  ('00000000-0000-0000-0000-000000000001', 21.1530000, 79.1050000, 'Gandhibagh Main Road', 'Gandhibagh', 'L3', 0.87, 'reported', 0.88, 42000, 'a6d8e4c1b3f5a9e2d7c4b8f1a3e6d9c2'),
  ('00000000-0000-0000-0000-000000000001', 21.1545000, 79.1080000, 'Itwari Railway Station Road, Gandhibagh', 'Gandhibagh', 'L2', 0.71, 'in_progress', 0.73, 16000, 'b7e9d5c2a4f6b1e3d8c5a9f2b4e7d1c3'),
  ('00000000-0000-0000-0000-000000000001', 21.1510000, 79.1030000, 'Maskasath Road, Gandhibagh', 'Gandhibagh', 'L1', 0.40, 'completed', 0.45, 6000, 'c8f1e6d3b5a7c2e4d9b6a1f3c5e8d4b8'),
  ('00000000-0000-0000-0000-000000000001', 21.1580000, 79.1120000, 'Lakadganj Chowk, Main Road', 'Lakadganj', 'L3', 0.90, 'reported', 0.90, 50000, 'd9a2e7c4b6f8d1e5c3b9a4f7d2e6c1b5'),
  ('00000000-0000-0000-0000-000000000001', 21.1600000, 79.1150000, 'Pardi, Lakadganj', 'Lakadganj', 'L2', 0.69, 'in_progress', 0.71, 13000, 'e1b3d8c5a7f9e2d4c6b1a8f5e3d7c2b9'),
  ('00000000-0000-0000-0000-000000000001', 21.1565000, 79.1100000, 'Nari Road, Lakadganj', 'Lakadganj', 'L1', 0.35, 'verified', 0.40, 4500, 'f2c4e9d6b8a1f3e5d7c9b2a6f8e1d4c3');

-- ═══════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════

alter table users enable row level security;
alter table potholes enable row level security;
alter table complaints enable row level security;
alter table contractors enable row level security;
alter table verifications enable row level security;

-- Public read access for potholes and contractors
create policy "Public read potholes" on potholes for select using (true);
create policy "Public read contractors" on contractors for select using (true);

-- Authenticated users can insert potholes
create policy "Authenticated insert potholes" on potholes for insert with check (auth.uid() is not null);

-- Users can read their own data
create policy "Users read own profile" on users for select using (auth.uid() = id);
create policy "Users insert own profile" on users for insert with check (auth.uid() = id);

-- Public read for complaints (transparency)
create policy "Public read complaints" on complaints for select using (true);
create policy "Authenticated insert complaints" on complaints for insert with check (auth.uid() is not null);

-- Verifications are public
create policy "Public read verifications" on verifications for select using (true);
create policy "Authenticated insert verifications" on verifications for insert with check (auth.uid() is not null);
