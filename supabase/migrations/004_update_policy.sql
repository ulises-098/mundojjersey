-- Ejecutar en Supabase: SQL Editor -> New query -> Run
-- Faltaba el permiso para EDITAR remeras (solo existían los de ver, crear
-- y borrar), así que los cambios del formulario de edición no se guardaban.

create policy "Solo usuarios logueados pueden editar productos"
on products for update
to authenticated
using (true)
with check (true);
