-- Ejecutar en Supabase: SQL Editor -> New query -> Run
-- Agrega el estado de stock de cada remera: "stock" (disponible ya) o
-- "encargue" (por encargue / a pedido).

alter table products
  add column if not exists stock_status text not null default 'stock';

alter table products
  drop constraint if exists products_stock_status_check;

alter table products
  add constraint products_stock_status_check
  check (stock_status in ('stock', 'encargue'));
