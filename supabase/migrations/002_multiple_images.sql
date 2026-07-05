-- Ejecutar en Supabase: SQL Editor -> New query -> Run
-- Pasa la tabla products de "una foto por remera" (image_url) a
-- "varias fotos por remera" (image_urls).

alter table products add column if not exists image_urls text[];

update products
set image_urls = array[image_url]
where image_urls is null and image_url is not null;

update products
set image_urls = '{}'
where image_urls is null;

alter table products alter column image_urls set not null;
alter table products alter column image_urls set default '{}';

alter table products drop column if exists image_url;
