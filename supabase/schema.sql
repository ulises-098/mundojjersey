-- Ejecutar este script en Supabase: Dashboard -> SQL Editor -> New query -> Run
-- (Este archivo refleja el esquema completo, pensado para un proyecto nuevo.
-- Si ya habías corrido una versión anterior de este archivo, mirá en cambio
-- supabase/migrations/002_multiple_images.sql)

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  club text not null,
  season text,
  category text not null check (category in ('retro', 'jugador')),
  price numeric not null check (price >= 0),
  sizes text[] not null default '{}',
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table products enable row level security;

create policy "Cualquiera puede ver los productos"
on products for select
to anon, authenticated
using (true);

create policy "Solo usuarios logueados pueden crear productos"
on products for insert
to authenticated
with check (true);

create policy "Solo usuarios logueados pueden borrar productos"
on products for delete
to authenticated
using (true);

-- Storage: bucket público para las fotos de las remeras.
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "Cualquiera puede ver las fotos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'products');

create policy "Solo usuarios logueados pueden subir fotos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'products');

create policy "Solo usuarios logueados pueden borrar fotos"
on storage.objects for delete
to authenticated
using (bucket_id = 'products');
