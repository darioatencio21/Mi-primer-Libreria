-- ============================================================
--  TU LIBROS YA — Datos de ejemplo (seed)
--  Ejecutar DESPUÉS de schema.sql, solo una vez.
-- ============================================================

-- ---------- CATEGORÍAS ----------
insert into categorias (name, slug, description, icon, sort_order) values
  ('Ficción', 'ficcion', 'Novelas, cuentos y relatos imaginarios.', 'book-open', 1),
  ('No Ficción', 'no-ficcion', 'Historia, biografía, ensayo y más.', 'newspaper', 2),
  ('Infantil', 'infantil', 'Libros para los más pequeños.', 'baby', 3),
  ('Autoayuda', 'autoayuda', 'Desarrollo personal y bienestar.', 'heart', 4),
  ('Académico', 'academico', 'Material de estudio y referencia.', 'graduation-cap', 5),
  ('Cómics', 'comics', 'Novelas gráficas y cómics.', 'image', 6),
  ('Poesía', 'poesia', 'Verso y lírica contemporánea.', 'feather', 7),
  ('Ciencia', 'ciencia', 'Divulgación y ciencia.', 'atom', 8);

-- ---------- AUTORES ----------
insert into autores (name, slug, bio) values
  ('Gabriel García Márquez', 'garcia-marquez', 'Escritor colombiano, premio Nobel de Literatura.'),
  ('Haruki Murakami', 'haruki-murakami', 'Escritor japonés contemporáneo.'),
  ('Yuval Noah Harari', 'yuval-harari', 'Historiador y escritor israelí.');

-- ---------- LIBROS ----------
-- Asumimos Ficción = 'ficcion' (primera categoría insertada arriba).
insert into libros (
  id, title, slug, autor_id, categoria_id, description, price, discount_price,
  discount_percentage, isbn, publisher, pages, language, publish_date,
  rating, review_count, stock, is_bestseller, is_new, tags
) values
  (
    '00000000-0000-0000-0000-000000000001',
    'Cien años de soledad',
    'cien-anos-de-soledad',
    (select id from autores where slug = 'garcia-marquez'),
    (select id from categorias where slug = 'ficcion'),
    'La obra maestra del realismo mágico, la historia de la familia Buendía en Macondo.',
    24.99, null, null,
    '9780307474728', 'Editorial Sudamericana', 471, 'Español', '1967-05-30',
    4.8, 2847, 15, true, false,
    array['realismo mágico', 'clásico']
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'El amor en los tiempos del cólera',
    'el-amor-en-los-tiempos-del-colera',
    (select id from autores where slug = 'garcia-marquez'),
    (select id from categorias where slug = 'ficcion'),
    'Una historia de amor que trasciende el tiempo y la distancia.',
    22.99, 18.39, 20,
    '9780307387264', 'Editorial Sudamericana', 368, 'Español', '1985-09-05',
    4.7, 1923, 8, true, false,
    array['romance', 'clásico']
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Kafka en la orilla',
    'kafka-en-la-orilla',
    (select id from autores where slug = 'haruki-murakami'),
    (select id from categorias where slug = 'ficcion'),
    'Un viaje surrealista entre dos mundos que se cruzan de forma misteriosa.',
    26.99, null, null,
    '9788483830714', 'Tusquets Editores', 505, 'Español', '2002-09-12',
    4.6, 1456, 12, true, false,
    array['surrealismo', 'contemporáneo']
  );
