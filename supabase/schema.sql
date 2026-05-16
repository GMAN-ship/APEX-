-- Supabase schema for APEX mobile dashboard

-- Global engine state and broker connection details
create table if not exists engine_status (
  id bigserial primary key,
  is_engine_active boolean default false,
  broker_server text default 'Enter Broker Server',
  account_id text,
  encrypted_password text,
  updated_at timestamptz default now(),
  updated_by uuid
);

-- Live account metrics from the VPS/MT5 terminal
create table if not exists account_metrics (
  id bigserial primary key,
  balance numeric(12,2) default 0.00,
  equity numeric(12,2) default 0.00,
  floating_pnl numeric(12,2) default 0.00,
  margin_level numeric(8,2) default 0.00,
  updated_at timestamptz default now()
);

-- Open positions from MT5 (active trades)
create table if not exists open_positions (
  id uuid primary key default gen_random_uuid(),
  ticket bigint not null,
  symbol text not null,
  order_type text not null check(order_type in ('BUY', 'SELL')),
  entry_price numeric(12,6),
  current_price numeric(12,6),
  lots numeric(10,4),
  pnl numeric(12,2),
  stop_loss numeric(12,6),
  take_profit numeric(12,6),
  opened_at timestamptz,
  updated_at timestamptz default now()
);

-- Commands pipeline used by the app and consumed by the VPS/MT5 bridge
create table if not exists trade_commands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  command_type text not null check (command_type in ('BUY','SELL','CLOSE_ALL','CLOSE_ID')),
  symbol text,
  lots numeric(10,4),
  target_position_id text,
  status text default 'PENDING' check(status in ('PENDING','EXECUTED','FAILED')),
  created_at timestamptz default now()
);

-- Persistent advanced EA strategy settings
create table if not exists strategy_settings (
  id integer primary key default 1,
  max_drawdown numeric,
  risk_per_trade numeric,
  sl_padding integer,
  tp_target integer,
  max_open integer,
  smart_breakeven boolean,
  min_fvg integer,
  ob_depth integer,
  ls_tf text,
  start_time text,
  end_time text,
  avoid_news boolean,
  updated_at timestamptz default now()
);

-- Historical trade actions for audit/logging
create table if not exists trade_actions (
  id uuid primary key default gen_random_uuid(),
  ticket bigint,
  symbol text,
  direction text check(direction in ('BUY','SELL','CLOSE')),
  volume numeric,
  profit numeric,
  open_time timestamptz,
  close_time timestamptz,
  status text,
  created_at timestamptz default now()
);

-- Enable row level security across all data tables
alter table engine_status enable row level security;
alter table account_metrics enable row level security;
alter table open_positions enable row level security;
alter table trade_commands enable row level security;
alter table strategy_settings enable row level security;
alter table trade_actions enable row level security;

create policy "authenticated read engine status" on engine_status
  for select using (auth.role() = 'authenticated');

create policy "authenticated update engine status" on engine_status
  for update, insert with check (auth.role() = 'authenticated' and auth.uid() is not null);

create policy "authenticated read account metrics" on account_metrics
  for select using (auth.role() = 'authenticated');

create policy "authenticated read open positions" on open_positions
  for select using (auth.role() = 'authenticated');

create policy "authenticated insert commands" on trade_commands
  for insert with check (auth.role() = 'authenticated' and user_id = auth.uid());

create policy "authenticated select commands" on trade_commands
  for select using (auth.role() = 'authenticated');

create policy "authenticated manage strategy" on strategy_settings
  for insert, update, select using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated read trade actions" on trade_actions
  for select using (auth.role() = 'authenticated');

-- Engine state also stores broker credentials; never store plaintext in the app.
-- Use service-side encryption via RPC and an Edge Function.

create extension if not exists pgcrypto;

create or replace function store_engine_status(p_server text, p_account text, p_password text, p_secret text)
returns void as $$
begin
  insert into engine_status (id, broker_server, account_id, encrypted_password, updated_at)
  values (1, p_server, p_account, encode(pgp_sym_encrypt(p_password, p_secret), 'base64'), now())
  on conflict (id) do update set broker_server = excluded.broker_server, account_id = excluded.account_id, encrypted_password = excluded.encrypted_password, updated_at = excluded.updated_at;
end;
$$ language plpgsql security definer;

create or replace function decrypt_engine_password(p_encrypted_base64 text, p_secret text)
returns text as $$
declare
  b bytea := decode(p_encrypted_base64, 'base64');
begin
  return pgp_sym_decrypt(b, p_secret);
end;
$$ language plpgsql security definer;



