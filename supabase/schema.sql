-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create admin_users Table
create table if not exists public.admin_users (
  user_id uuid references auth.users(id) on delete cascade primary key,
  role text default 'admin' check (role in ('admin', 'super-admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create drivers Table
create table if not exists public.drivers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  fullname text not null,
  car_plate text not null unique,
  phone_number text not null,
  whatsapp_enabled boolean default true,
  instagram_username text,
  emergency_status text default 'active' check (emergency_status in ('active', 'inactive', 'urgent')),
  custom_slug text unique,
  car_photo_url text,
  owner_id uuid references auth.users(id) on delete set null
);

-- Indexes for performance
create index if not exists idx_drivers_car_plate on public.drivers (car_plate);
create index if not exists idx_drivers_custom_slug on public.drivers (custom_slug);

-- 3. Create notification_logs Table
create table if not exists public.notification_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip_address text not null default coalesce(
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    '127.0.0.1'
  ),
  driver_id uuid references public.drivers(id) on delete cascade
);

create index if not exists idx_notification_logs_ip_created on public.notification_logs (ip_address, created_at);

-- 4. Enable Row Level Security (RLS)
alter table public.drivers enable row level security;
alter table public.admin_users enable row level security;
alter table public.notification_logs enable row level security;

-- RLS Policies for drivers
create policy "Sürücülər hər kəs tərəfindən oxuna bilər" 
  on public.drivers for select using (true);

create policy "Yalnız adminlər yeni sürücü əlavə edə bilər" 
  on public.drivers for insert 
  with check (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    )
  );

create policy "Adminlər və ya profil sahibi sürücünü yeniləyə bilər" 
  on public.drivers for update 
  using (
    auth.uid() = owner_id or
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = owner_id or
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    )
  );

create policy "Yalnız adminlər sürücünü silə bilər" 
  on public.drivers for delete 
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    )
  );

-- RLS Policies for admin_users
create policy "Adminlər öz profilini oxuya bilər" 
  on public.admin_users for select 
  using (auth.uid() = user_id);

create policy "Super-adminlər bütün adminləri idarə edə bilər" 
  on public.admin_users for all 
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and role = 'super-admin'
    )
  );

-- RLS Policies for notification_logs
create policy "Hər kəs bildiriş logu yarada bilər" 
  on public.notification_logs for insert 
  with check (true);

create policy "Sürücülər və ya adminlər bildiriş loglarını oxuya bilər" 
  on public.notification_logs for select 
  using (
    exists (
      select 1 from public.drivers
      where id = driver_id and owner_id = auth.uid()
    ) or
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    )
  );

-- 5. Rate Limiting Function and Trigger (Postgres level)
create or replace function public.check_notification_rate_limit()
returns trigger as $$
declare
  log_count int;
begin
  select count(*) into log_count
  from public.notification_logs
  where ip_address = new.ip_address
    and created_at >= now() - interval '5 minutes';

  if log_count >= 3 then
    raise exception 'Rate limit exceeded. Maximum 3 notification attempts allowed every 5 minutes.';
  end if;

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger trg_check_rate_limit
  before insert on public.notification_logs
  for each row execute function public.check_notification_rate_limit();

-- 6. Storage Bucket Configuration (car-photos)
-- Note: Bucket setup may require administrative privileges. This can also be set up directly in the Supabase console.
insert into storage.buckets (id, name, public)
values ('car-photos', 'car-photos', true)
on conflict (id) do nothing;

create policy "Şəkilləri hər kəs görə bilər"
  on storage.objects for select
  using (bucket_id = 'car-photos');

create policy "Şəkilləri yalnız adminlər yükləyə bilər"
  on storage.objects for insert
  with check (
    bucket_id = 'car-photos' and
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    )
  );

create policy "Şəkilləri yalnız adminlər silə bilər"
  on storage.objects for delete
  using (
    bucket_id = 'car-photos' and
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    )
  );

-- 7. Bootstrap Trigger: Automatically make the first registered user a super-admin
create or replace function public.handle_first_user_signup()
returns trigger as $$
declare
  admin_count int;
begin
  select count(*) into admin_count from public.admin_users;
  
  if admin_count = 0 then
    insert into public.admin_users (user_id, role)
    values (new.id, 'super-admin');
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger trg_first_user_signup
  after insert on auth.users
  for each row execute function public.handle_first_user_signup();
