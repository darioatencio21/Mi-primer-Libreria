-- ============================================================
--  Esquema DDL del proyecto "Tus Libros Ya" (fuente de verdad local)
--  Tablas en inglés (mismo esquema que usaba el frontend vía Supabase),
--  + auth propia: users y sessions (reemplazan auth.users de Supabase).
--  Sin RLS: la app se conecta con un único rol de aplicación.
-- ============================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- Auth propia ----------

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text,
  phone text,
  default_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index sessions_user_id_idx on sessions (user_id);
create index sessions_token_hash_idx on sessions (token_hash);

-- ---------- Catálogo ----------

create table authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text not null default '',
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  icon text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  isbn text not null unique,
  publisher text,
  pages integer,
  language text not null default 'Español',
  publish_date date,
  dimensions text,
  price numeric(10,2) not null,
  discount_price numeric(10,2),
  discount_percentage integer,
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  stock integer not null default 0,
  is_bestseller boolean not null default false,
  is_new boolean not null default false,
  cover_image_url text not null,
  author_id uuid not null references authors(id),
  category_id uuid not null references categories(id),
  search_vector tsvector generated always as (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(isbn, '') || ' ' || coalesce(publisher, '') || ' ' || coalesce(description, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table book_formats (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  type text not null check (type in ('hardcover', 'paperback', 'ebook', 'audiobook')),
  price numeric(10,2) not null,
  stock integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (book_id, type)
);

create table book_images (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  url text not null,
  position integer not null default 0
);

create table book_tags (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  tag text not null,
  unique (book_id, tag)
);

create table profiles (
  id uuid primary key references users(id) on delete cascade,
  full_name text,
  phone text,
  default_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete set null,
  user_id uuid,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text,
  content text not null default '',
  helpful_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  book_id uuid not null references books(id) on delete cascade,
  format text not null check (format in ('hardcover', 'paperback', 'ebook', 'audiobook')),
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, book_id, format)
);

create table wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  book_id uuid not null references books(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, book_id)
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  shipping_address jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  book_id uuid references books(id) on delete set null,
  title text not null,
  format text,
  quantity integer not null check (quantity > 0),
  price numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- ---------- Índices ----------

create index books_author_id_idx on books (author_id);
create index books_category_id_idx on books (category_id);
create index books_is_bestseller_idx on books (is_bestseller) where is_bestseller;
create index books_is_new_idx on books (is_new) where is_new;
create index books_language_idx on books (language);
create index books_title_trgm_idx on books using gin (title gin_trgm_ops);
create index books_publisher_trgm_idx on books using gin (publisher gin_trgm_ops);
create index books_isbn_trgm_idx on books using gin (isbn gin_trgm_ops);
create index books_search_vector_idx on books using gin (search_vector);
create index book_images_book_id_idx on book_images (book_id);
create index book_tags_book_id_idx on book_tags (book_id);
create index book_formats_book_id_idx on book_formats (book_id);
create index reviews_book_id_idx on reviews (book_id);
create index cart_items_user_id_idx on cart_items (user_id);
create index wishlist_items_user_id_idx on wishlist_items (user_id);
create index orders_user_id_idx on orders (user_id);
create index order_items_order_id_idx on order_items (order_id);

-- ---------- Configuración de la tienda (pagos, envíos, precios) ----------

create table settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------- Triggers ----------

create trigger users_updated_at
  before update on users
  for each row execute function set_updated_at();
create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();
create trigger authors_updated_at
  before update on authors
  for each row execute function set_updated_at();
create trigger categories_updated_at
  before update on categories
  for each row execute function set_updated_at();
create trigger books_updated_at
  before update on books
  for each row execute function set_updated_at();
create trigger book_formats_updated_at
  before update on book_formats
  for each row execute function set_updated_at();
create trigger reviews_updated_at
  before update on reviews
  for each row execute function set_updated_at();
create trigger cart_items_updated_at
  before update on cart_items
  for each row execute function set_updated_at();
create trigger wishlist_items_updated_at
  before update on wishlist_items
  for each row execute function set_updated_at();
create trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();