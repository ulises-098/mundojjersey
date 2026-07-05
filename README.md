# Mundo JJersey — Catálogo de remeras

Web de catálogo de remeras (retro / jugador) con consulta directa por WhatsApp
y un panel de administración para subir y borrar remeras.

## Stack

- **Next.js + Tailwind CSS** — la web (catálogo público + panel admin).
- **Supabase** — base de datos de productos, storage de fotos, y login del admin.
- **Vercel** — hosting gratuito recomendado.

## Configuración local

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar `.env.local.example` a `.env.local` y completar los valores (ver
   sección "Supabase" abajo).

3. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abrir [http://localhost:3000](http://localhost:3000).

## Supabase (base de datos, fotos y login)

1. Crear un proyecto gratis en [supabase.com](https://supabase.com).
2. En **SQL Editor → New query**, pegar y ejecutar el contenido de
   [`supabase/schema.sql`](supabase/schema.sql). Esto crea:
   - la tabla `products`,
   - el bucket de storage `products` (público, para las fotos),
   - los permisos (RLS): cualquiera puede ver el catálogo, pero solo un
     usuario logueado puede crear o borrar remeras.
3. En **Authentication → Users → Add user**, crear el usuario admin (email +
   contraseña) con el que tu amigo va a entrar a `/admin`.
4. En **Project Settings → API**, copiar:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   No hace falta la `service_role` / `secret key` en ningún lado del proyecto:
   el panel admin funciona con sesión de usuario + permisos (RLS), así que esa
   clave (que tiene acceso total, saltándose los permisos) no se usa ni se
   guarda.

## Variables de entorno (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SITE_NAME=Mundo JJersey
NEXT_PUBLIC_WHATSAPP_NUMBER=5491122334455
```

`NEXT_PUBLIC_WHATSAPP_NUMBER` es el número de WhatsApp del negocio, con código
de país, sin espacios ni signos (ej: Argentina `5491122334455`).

## Uso del panel de administración

- Entrar a `/admin/login` con el email y contraseña creados en Supabase.
- **+ Nueva remera**: subir foto, nombre, club/selección, temporada, categoría
  (retro o jugador), precio y talles.
- **Eliminar**: borra la remera del catálogo y su foto del storage.

## Deploy en Vercel (gratis)

1. Subir este proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com), **Add New → Project**, importar el
   repo.
3. En **Environment Variables**, cargar las mismas variables del `.env.local`.
4. Deploy. Vercel te da una URL pública (se puede conectar un dominio propio
   después).
