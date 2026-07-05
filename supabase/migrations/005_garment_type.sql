-- Ejecutar en Supabase: SQL Editor -> New query -> Run
-- Agrega el tipo de prenda (remera, short, campera, conjunto), que solo
-- aplica a los productos "por encargue". Los que están "en stock" quedan
-- con garment_type en null (se asume que son remeras).

alter table products
  add column if not exists garment_type text;

alter table products
  drop constraint if exists products_garment_type_check;

alter table products
  add constraint products_garment_type_check
  check (garment_type is null or garment_type in ('remera', 'short', 'campera', 'conjunto'));
