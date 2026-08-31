-- ============================================================
--  TU LIBROS YA — Limpieza + Esquema completo (una sola ejecución)
--  Ejecuta TODO en el SQL Editor de Supabase de una vez.
--  (Los DROP al inicio borran versiones anteriores si existían.)
-- ============================================================

-- ---------- LIMPIEZA (seguro ejecutar varias veces) ----------
drop table if exists lista_deseos cascade;
drop table if exists pedido_items cascade;
drop table if exists pedidos cascade;
drop table if exists direcciones cascade;
drop table if exists carrito_items cascade;
drop table if exists carritos cascade;
drop table if exists resenas cascade;
drop table if exists libro_imagenes cascade;
drop table if exists libro_formatos cascade;
drop table if exists libros cascade;
drop table if exists categorias cascade;
drop table if exists autores cascade;
drop table if exists profiles cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.recalcular_rating_libro() cascade;
drop function if exists public.is_admin() cascade;
drop function if exists public.set_updated_at() cascade;
drop type if exists book_format_enum cascade;
drop type if exists order_status_enum cascade;
drop type if exists user_role_enum cascade;
drop extension if exists "pgcrypto";

-- ---------- EXTENSIONES ----------
create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
create type book_format_enum as enum (
  'hardcover',
  'paperback',
  'ebook',
  'audiobook'
);

create type order_status_enum as enum (
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

create type user_role_enum as enum (
  'customer',
  'admin'
);

-- ---------- PERFILES ----------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role user_role_enum not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- AUTORES ----------
create table autores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text not null default '',
  photo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- CATEGORÍAS ----------
create table categorias (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  icon text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- LIBROS ----------
create table libros (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  autor_id uuid not null references autores (id) on delete restrict,
  categoria_id uuid not null references categorias (id) on delete restrict,
  description text not null default '',
  price numeric(10, 2) not null default 0,
  discount_price numeric(10, 2),
  discount_percentage integer check (discount_percentage between 0 and 100),
  cover_image text not null default '',
  isbn text,
  publisher text,
  pages integer,
  language text not null default 'Español',
  publish_date date,
  dimensions text,
  rating numeric(3, 2) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0,
  stock integer not null default 0 check (stock >= 0),
  is_bestseller boolean not null default false,
  is_new boolean not null default false,
  tags text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_libros_categoria on libros (categoria_id);
create index idx_libros_autor on libros (autor_id);
create index idx_libros_slug on libros (slug);
create index idx_libros_bestseller on libros (is_bestseller) where is_bestseller = true;
create index idx_libros_nuevo on libros (is_new) where is_new = true;

-- ---------- FORMATOS E IMÁGENES ----------
create table libro_formatos (
  id uuid primary key default gen_random_uuid(),
  libro_id uuid not null references libros (id) on delete cascade,
  format_type book_format_enum not null,
  price numeric(10, 2) not null default 0,
  stock integer not null default 0 check (stock >= 0),
  unique (libro_id, format_type)
);

create index idx_libro_formatos_libro on libro_formatos (libro_id);

create table libro_imagenes (
  id uuid primary key default gen_random_uuid(),
  libro_id uuid not null references libros (id) on delete cascade,
  url text not null,
  alt text,
  sort_order integer not null default 0
);

create index idx_libro_imagenes_libro on libro_imagenes (libro_id);

-- ---------- RESEÑAS ----------
create table resenas (
  id uuid primary key default gen_random_uuid(),
  libro_id uuid not null references libros (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text not null default '',
  content text not null default '',
  helpful_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (libro_id, user_id)
);

create index idx_resenas_libro on resenas (libro_id);

create or replace function public.recalcular_rating_libro()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update libros
  set rating = round((select avg(rating) from resenas where libro_id = coalesce(new.libro_id, old.libro_id)), 2),
      review_count = (select count(*) from resenas where libro_id = coalesce(new.libro_id, old.libro_id))
  where id = coalesce(new.libro_id, old.libro_id);
  return null;
end;
$$;

create trigger trg_recalcular_rating
  after insert or update or delete on resenas
  for each row execute procedure public.recalcular_rating_libro();

-- ---------- CARRITO ----------
create table carritos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id),
  unique (session_id)
);

create table carrito_items (
  id uuid primary key default gen_random_uuid(),
  carrito_id uuid not null references carritos (id) on delete cascade,
  libro_id uuid not null references libros (id) on delete cascade,
  format_type book_format_enum not null default 'paperback',
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (carrito_id, libro_id, format_type)
);

-- ---------- DIRECCIONES ----------
create table direcciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  street text not null,
  city text not null,
  postal_code text not null,
  country text not null default 'Argentina',
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_direcciones_user on direcciones (user_id);

-- ---------- PEDIDOS ----------
create table pedidos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  numero text not null unique,
  subtotal numeric(10, 2) not null default 0,
  shipping numeric(10, 2) not null default 0,
  tax numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  status order_status_enum not null default 'pending',
  shipping_address jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_pedidos_user on pedidos (user_id);
create index idx_pedidos_status on pedidos (status);

create table pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos (id) on delete cascade,
  libro_id uuid references libros (id) on delete set null,
  title text not null,
  format_type book_format_enum not null,
  quantity integer not null,
  price numeric(10, 2) not null
);

create index idx_pedido_items_pedido on pedido_items (pedido_id);

-- ---------- LISTA DE DESEOS ----------
create table lista_deseos (
  user_id uuid not null references auth.users (id) on delete cascade,
  libro_id uuid not null references libros (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, libro_id)
);

-- ---------- FUNCIONES ----------
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated before update on profiles
  for each row execute procedure public.set_updated_at();
create trigger trg_autores_updated before update on autores
  for each row execute procedure public.set_updated_at();
create trigger trg_libros_updated before update on libros
  for each row execute procedure public.set_updated_at();
create trigger trg_pedidos_updated before update on pedidos
  for each row execute procedure public.set_updated_at();
create trigger trg_carritos_updated before update on carritos
  for each row execute procedure public.set_updated_at();

-- ---------- RLS ----------
alter table profiles enable row level security;
create policy "perfil: leer el propio"
  on profiles for select using (auth.uid() = id or public.is_admin());
create policy "perfil: actualizar el propio"
  on profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "perfil: insertar el propio"
  on profiles for insert with check (auth.uid() = id);

alter table autores enable row level security;
alter table categorias enable row level security;
alter table libros enable row level security;
alter table libro_formatos enable row level security;
alter table libro_imagenes enable row level security;

create policy "catalogo: lectura publica" on autores for select using (true);
create policy "catalogo: lectura publica" on categorias for select using (true);
create policy "catalogo: lectura publica" on libros for select using (active = true);
create policy "catalogo: lectura publica" on libro_formatos for select using (true);
create policy "catalogo: lectura publica" on libro_imagenes for select using (true);

create policy "catalogo: escritura admin" on autores for all using (public.is_admin()) with check (public.is_admin());
create policy "catalogo: escritura admin" on categorias for all using (public.is_admin()) with check (public.is_admin());
create policy "catalogo: escritura admin" on libros for all using (public.is_admin()) with check (public.is_admin());
create policy "catalogo: escritura admin" on libro_formatos for all using (public.is_admin()) with check (public.is_admin());
create policy "catalogo: escritura admin" on libro_imagenes for all using (public.is_admin()) with check (public.is_admin());

alter table resenas enable row level security;
create policy "resenas: lectura publica" on resenas for select using (true);
create policy "resenas: insertar propias" on resenas for insert with check (auth.uid() = user_id);
create policy "resenas: editar propias" on resenas for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "resenas: borrar propias" on resenas for delete using (auth.uid() = user_id);

alter table carritos enable row level security;
alter table carrito_items enable row level security;
create policy "carrito: propia" on carritos for all using (user_id = auth.uid());
create policy "carrito: items propios" on carrito_items for all
  using (carrito_id in (select id from carritos where user_id = auth.uid()));

alter table direcciones enable row level security;
create policy "direcciones: propias" on direcciones for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table pedidos enable row level security;
alter table pedido_items enable row level security;
create policy "pedidos: propios" on pedidos for all
  using (user_id = auth.uid() or public.is_admin());
create policy "pedidos: items" on pedido_items for select
  using (pedido_id in (select id from pedidos where user_id = auth.uid() or public.is_admin()));

alter table lista_deseos enable row level security;
create policy "deseos: propios" on lista_deseos for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
