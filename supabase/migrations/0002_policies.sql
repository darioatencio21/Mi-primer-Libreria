create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' in ('admin', 'service_role'), false)
$$;

alter table authors enable row level security;
alter table categories enable row level security;
alter table books enable row level security;
alter table book_formats enable row level security;
alter table book_images enable row level security;
alter table book_tags enable row level security;
alter table profiles enable row level security;
alter table reviews enable row level security;
alter table cart_items enable row level security;
alter table wishlist_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "catalogo de autores publico" on authors
  for select using (true);
create policy "admin gestiona autores" on authors
  for all using (is_admin()) with check (is_admin());

create policy "catalogo de categorias publico" on categories
  for select using (true);
create policy "admin gestiona categorias" on categories
  for all using (is_admin()) with check (is_admin());

create policy "catalogo de libros publico" on books
  for select using (true);
create policy "admin gestiona libros" on books
  for all using (is_admin()) with check (is_admin());

create policy "formatos de libros publicos" on book_formats
  for select using (true);
create policy "admin gestiona formatos" on book_formats
  for all using (is_admin()) with check (is_admin());

create policy "imagenes de libros publicas" on book_images
  for select using (true);
create policy "admin gestiona imagenes" on book_images
  for all using (is_admin()) with check (is_admin());

create policy "etiquetas de libros publicas" on book_tags
  for select using (true);
create policy "admin gestiona etiquetas" on book_tags
  for all using (is_admin()) with check (is_admin());

create policy "perfil propio visible" on profiles
  for select using (auth.uid() = id);
create policy "crear mi perfil" on profiles
  for insert with check (auth.uid() = id);
create policy "actualizar mi perfil" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "resenas publicas" on reviews
  for select using (true);
create policy "usuarios autenticados publican resenas" on reviews
  for insert with check (auth.uid() is not null);
create policy "autor actualiza su resena" on reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "autor elimina su resena" on reviews
  for delete using (auth.uid() = user_id);

create policy "ver mi carrito" on cart_items
  for select using (auth.uid() = user_id);
create policy "agregar a mi carrito" on cart_items
  for insert with check (auth.uid() = user_id);
create policy "actualizar mi carrito" on cart_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "quitar de mi carrito" on cart_items
  for delete using (auth.uid() = user_id);

create policy "ver mi lista de deseos" on wishlist_items
  for select using (auth.uid() = user_id);
create policy "agregar a mi lista de deseos" on wishlist_items
  for insert with check (auth.uid() = user_id);
create policy "quitar de mi lista de deseos" on wishlist_items
  for delete using (auth.uid() = user_id);

create policy "ver mis ordenes" on orders
  for select using (auth.uid() = user_id);
create policy "crear mis ordenes" on orders
  for insert with check (auth.uid() = user_id);
create policy "actualizar mis ordenes" on orders
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ver items de mis ordenes" on order_items
  for select using (exists (
    select 1 from orders o where o.id = order_id and o.user_id = auth.uid()
  ));
create policy "crear items de mis ordenes" on order_items
  for insert with check (exists (
    select 1 from orders o where o.id = order_id and o.user_id = auth.uid()
  ));