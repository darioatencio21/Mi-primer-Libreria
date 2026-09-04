-- ============================================================
--  Seed inicial: catálogo + usuario demo + pedidos de ejemplo.
--  Portadas = archivos estáticos en public/covers (rutas relativas).
-- ============================================================

insert into categories (id, slug, name, description, icon) values
  ('c0000000-0000-0000-0000-000000000001', 'ficcion', 'Ficción', 'Historias que exploran la condición humana', 'book-open'),
  ('c0000000-0000-0000-0000-000000000002', 'no-ficcion', 'No Ficción', 'Ideas que transforman nuestra comprensión del mundo', 'newspaper'),
  ('c0000000-0000-0000-0000-000000000003', 'infantil', 'Infantil', 'Aventuras para jóvenes lectores curiosos', 'baby'),
  ('c0000000-0000-0000-0000-000000000004', 'autoayuda', 'Autoayuda', 'Herramientas para el crecimiento personal', 'heart'),
  ('c0000000-0000-0000-0000-000000000005', 'academico', 'Académico', 'Conocimiento especializado para profesionales y estudiantes', 'graduation-cap'),
  ('c0000000-0000-0000-0000-000000000006', 'comics', 'Cómics', 'Narrativa visual que desafía convenciones', 'image'),
  ('c0000000-0000-0000-0000-000000000007', 'poesia', 'Poesía', 'La belleza del lenguaje en su forma más pura', 'feather'),
  ('c0000000-0000-0000-0000-000000000008', 'ciencia', 'Ciencia', 'Descubrimientos que expanden los límites del saber', 'atom');

insert into authors (id, slug, name, bio) values
  ('a0000000-0000-0000-0000-000000000001', 'garcia-marquez', 'Gabriel García Márquez', 'Premio Nobel de Literatura 1982. Escritor colombiano, máximo exponente del realismo mágico y uno de los autores más importantes del siglo XX en lengua española.'),
  ('a0000000-0000-0000-0000-000000000002', 'haruki-murakami', 'Haruki Murakami', 'Escritor y traductor japonés, maestro del surrealismo y el realismo contemporáneo. Sus novelas combinan lo cotidiano con lo fantástico.'),
  ('a0000000-0000-0000-0000-000000000003', 'yuval-harari', 'Yuval Noah Harari', 'Historiador y profesor israelí, autor de bestsellers que exploran la historia y el futuro de la humanidad.'),
  ('a0000000-0000-0000-0000-000000000004', 'saint-exupery', 'Antoine de Saint-Exupéry', 'Escritor y aviador francés, autor de clásicos universales de la literatura infantil y del sentido de la vida.'),
  ('a0000000-0000-0000-0000-000000000005', 'isabel-allende', 'Isabel Allende', 'Escritora chilena, una de las voces más leídas de la literatura latinoamericana contemporánea.'),
  ('a0000000-0000-0000-0000-000000000006', 'jorge-luis-borges', 'Jorge Luis Borges', 'Escritor y poeta argentino, maestro del cuento fantástico y de la literatura universal del siglo XX.');

insert into books
  (id, slug, title, description, isbn, publisher, pages, language, publish_date, dimensions, price, discount_price, discount_percentage, rating, review_count, stock, is_bestseller, is_new, cover_image_url, author_id, category_id)
values
  ('b0000000-0000-0000-0000-000000000001', 'cien-anos-de-soledad', 'Cien años de soledad', 'La obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo. Una saga familiar épica que explora temas de amor, soledad, destino y la naturaleza cíclica del tiempo.',
   '978-0-00-000000-0', 'Editorial Sudamericana', 471, 'Español', '1967-05-30', '14 × 21 cm', 24.99, 19.99, 20, 4.8, 2847, 15, true, false, '/placeholder-book.svg',
   (select id from authors where slug = 'garcia-marquez'), (select id from categories where slug = 'ficcion')),
  ('b0000000-0000-0000-0000-000000000002', 'amor-tiempos-colera', 'El amor en los tiempos del cólera', 'Una historia de amor que trasciende el tiempo. Florentino Ariza espera cincuenta y un años para volver a amar a Fermina Daza.',
   '978-0-00-000000-1', 'Editorial Sudamericana', 368, 'Español', '1985-09-05', '13 × 20 cm', 22.99, 18.39, 20, 4.7, 1923, 8, true, false, '/placeholder-book.svg',
   (select id from authors where slug = 'garcia-marquez'), (select id from categories where slug = 'ficcion')),
  ('b0000000-0000-0000-0000-000000000003', 'kafka-en-la-orilla', 'Kafka en la orilla', 'Un viaje surrealista entre dos mundos. Un chico que huye de su casa y la búsqueda de un viejo escritor se cruzan en una novela de identidad y destino.',
   '978-0-00-000000-2', 'Tusquets Editores', 505, 'Español', '2002-09-12', '13 × 20 cm', 26.99, null, null, 4.6, 1456, 12, true, false, '/placeholder-book.svg',
   (select id from authors where slug = 'haruki-murakami'), (select id from categories where slug = 'ficcion')),
  ('b0000000-0000-0000-0000-000000000004', 'sapiens-de-animales-a-dioses', 'Sapiens: De animales a dioses', 'Una breve historia de la humanidad. Desde la Revolución Cognitiva hasta la era tecnológica, el viaje de nuestra especie contado con claridad.',
   '978-0-00-000000-3', 'Debate', 496, 'Español', '2014-09-04', '15 × 23 cm', 29.99, null, null, 4.7, 3892, 20, true, false, '/placeholder-book.svg',
   (select id from authors where slug = 'yuval-harari'), (select id from categories where slug = 'no-ficcion')),
  ('b0000000-0000-0000-0000-000000000005', 'el-principito', 'El principito', 'Lo esencial es invisible a los ojos. Un aviador perdido en el desierto conoce a un pequeño príncipe que llegó de un asteroide.',
   '978-0-00-000000-4', 'Salamandra', 96, 'Español', '1943-04-06', '12 × 17 cm', 14.99, null, null, 4.9, 5621, 30, true, false, '/placeholder-book.svg',
   (select id from authors where slug = 'saint-exupery'), (select id from categories where slug = 'infantil')),
  ('b0000000-0000-0000-0000-000000000006', 'tokio-blues', 'Tokio blues', 'Una novela sobre la juventud y la nostalgia. Toru Watanabe recuerda su época de estudiante y la chica que no deja de vivir en su memoria.',
   '978-0-00-000000-5', 'Tusquets Editores', 352, 'Español', '1987-09-04', '13 × 20 cm', 23.99, null, null, 4.5, 1234, 10, false, true, '/placeholder-book.svg',
   (select id from authors where slug = 'haruki-murakami'), (select id from categories where slug = 'ficcion')),
  ('b0000000-0000-0000-0000-000000000007', '21-lecciones-siglo-xxi', '21 lecciones para el siglo XXI', 'Reflexiones sobre los desafíos del presente: tecnología, política, religión y el futuro del trabajo en un mundo que cambia deprisa.',
   '978-0-00-000000-6', 'Debate', 496, 'Español', '2018-08-30', '15 × 23 cm', 27.99, null, null, 4.6, 2156, 18, false, true, '/placeholder-book.svg',
   (select id from authors where slug = 'yuval-harari'), (select id from categories where slug = 'no-ficcion')),
  ('b0000000-0000-0000-0000-000000000008', 'cronica-muerte-anunciada', 'Crónica de una muerte anunciada', 'Un crimen inevitable en un pueblo caribeño. Todo el pueblo sabe que van a matar a Santiago Nasar, y nadie hace nada por evitarlo.',
   '978-0-00-000000-7', 'Editorial Sudamericana', 122, 'Español', '1981-04-07', '12 × 19 cm', 19.99, null, null, 4.7, 1876, 22, false, false, '/placeholder-book.svg',
   (select id from authors where slug = 'garcia-marquez'), (select id from categories where slug = 'ficcion')),
  ('b0000000-0000-0000-0000-000000000009', 'norwegian-wood', 'Norwegian Wood', 'Una historia de pérdida y madurez. La nostalgia de Toru por la bella e inestable Naoko atraviesa una juventud marcada por la música de los Beatles.',
   '978-0-00-000000-8', 'Tusquets Editores', 296, 'Español', '1987-09-04', '13 × 20 cm', 24.99, null, null, 4.4, 987, 14, false, false, '/placeholder-book.svg',
   (select id from authors where slug = 'haruki-murakami'), (select id from categories where slug = 'ficcion')),
  ('b0000000-0000-0000-0000-000000000010', 'coronel-no-tiene-quien-le-escriba', 'El coronel no tiene quien le escriba', 'La espera digna de un coronel olvidado. Un viejo coronel espera una pensión que nunca llega mientras sostiene a su mujer enferma.',
   '978-0-00-000000-9', 'Editorial Sudamericana', 92, 'Español', '1961-01-01', '12 × 19 cm', 16.99, null, null, 4.5, 1234, 0, false, false, '/placeholder-book.svg',
   (select id from authors where slug = 'garcia-marquez'), (select id from categories where slug = 'ficcion')),
  ('b0000000-0000-0000-0000-000000000011', 'la-casa-de-los-espiritus', 'La casa de los espíritus', 'La historia de la familia Trueba a través de cuatro generaciones, un fresco íntimo de la sociedad chilena atravesado por lo sobrenatural.',
   '978-0-00-000000-10', 'Sudamericana', 512, 'Español', '1982-06-15', '14 × 21 cm', 26.99, 22.94, 15, 4.6, 2143, 9, false, true, '/placeholder-book.svg',
   (select id from authors where slug = 'isabel-allende'), (select id from categories where slug = 'ficcion')),
  ('b0000000-0000-0000-0000-000000000012', 'ficciones', 'Ficciones', 'Los relatos breves y laberínticos de Borges: bibliotecas infinitas, lenguas inventadas y, quizá, un millón de realidades posibles.',
   '978-0-00-000000-11', 'Emecé', 212, 'Español', '1944-07-01', '12 × 19 cm', 21.99, null, null, 4.8, 3105, 17, false, false, '/placeholder-book.svg',
   (select id from authors where slug = 'jorge-luis-borges'), (select id from categories where slug = 'ficcion'));

insert into book_formats (book_id, type, price, stock) values
  ((select id from books where slug = 'cien-anos-de-soledad'), 'hardcover', 34.99, 8),
  ((select id from books where slug = 'cien-anos-de-soledad'), 'paperback', 19.99, 15),
  ((select id from books where slug = 'cien-anos-de-soledad'), 'ebook', 9.99, 999),
  ((select id from books where slug = 'cien-anos-de-soledad'), 'audiobook', 14.99, 999),
  ((select id from books where slug = 'amor-tiempos-colera'), 'hardcover', 32.99, 6),
  ((select id from books where slug = 'amor-tiempos-colera'), 'paperback', 18.39, 8),
  ((select id from books where slug = 'amor-tiempos-colera'), 'ebook', 8.99, 999),
  ((select id from books where slug = 'kafka-en-la-orilla'), 'hardcover', 26.99, 12),
  ((select id from books where slug = 'kafka-en-la-orilla'), 'paperback', 21.99, 4),
  ((select id from books where slug = 'kafka-en-la-orilla'), 'ebook', 9.99, 999),
  ((select id from books where slug = 'kafka-en-la-orilla'), 'audiobook', 13.99, 999),
  ((select id from books where slug = 'sapiens-de-animales-a-dioses'), 'hardcover', 42.99, 5),
  ((select id from books where slug = 'sapiens-de-animales-a-dioses'), 'paperback', 29.99, 20),
  ((select id from books where slug = 'sapiens-de-animales-a-dioses'), 'ebook', 14.99, 999),
  ((select id from books where slug = 'el-principito'), 'hardcover', 14.99, 30),
  ((select id from books where slug = 'el-principito'), 'paperback', 10.99, 45),
  ((select id from books where slug = 'el-principito'), 'ebook', 4.99, 999),
  ((select id from books where slug = 'el-principito'), 'audiobook', 6.99, 999),
  ((select id from books where slug = 'tokio-blues'), 'paperback', 23.99, 10),
  ((select id from books where slug = 'tokio-blues'), 'hardcover', 35.99, 7),
  ((select id from books where slug = 'tokio-blues'), 'ebook', 10.99, 999),
  ((select id from books where slug = '21-lecciones-siglo-xxi'), 'paperback', 27.99, 18),
  ((select id from books where slug = '21-lecciones-siglo-xxi'), 'ebook', 13.99, 999),
  ((select id from books where slug = 'cronica-muerte-anunciada'), 'paperback', 19.99, 22),
  ((select id from books where slug = 'cronica-muerte-anunciada'), 'ebook', 8.99, 999),
  ((select id from books where slug = 'norwegian-wood'), 'paperback', 24.99, 14),
  ((select id from books where slug = 'norwegian-wood'), 'ebook', 11.99, 999),
  ((select id from books where slug = 'coronel-no-tiene-quien-le-escriba'), 'paperback', 16.99, 0),
  ((select id from books where slug = 'coronel-no-tiene-quien-le-escriba'), 'ebook', 7.99, 999),
  ((select id from books where slug = 'la-casa-de-los-espiritus'), 'hardcover', 38.99, 3),
  ((select id from books where slug = 'la-casa-de-los-espiritus'), 'paperback', 26.99, 9),
  ((select id from books where slug = 'la-casa-de-los-espiritus'), 'ebook', 12.99, 999),
  ((select id from books where slug = 'ficciones'), 'paperback', 21.99, 17),
  ((select id from books where slug = 'ficciones'), 'ebook', 9.99, 999);

insert into book_images (book_id, url, position)
select id, '/placeholder-book.svg', 0 from books;

insert into book_tags (book_id, tag) values
  ((select id from books where slug = 'cien-anos-de-soledad'), 'realismo mágico'),
  ((select id from books where slug = 'cien-anos-de-soledad'), 'clásico'),
  ((select id from books where slug = 'cien-anos-de-soledad'), 'latinoamérica'),
  ((select id from books where slug = 'amor-tiempos-colera'), 'romance'),
  ((select id from books where slug = 'amor-tiempos-colera'), 'clásico'),
  ((select id from books where slug = 'kafka-en-la-orilla'), 'surrealismo'),
  ((select id from books where slug = 'kafka-en-la-orilla'), 'contemporáneo'),
  ((select id from books where slug = 'sapiens-de-animales-a-dioses'), 'historia'),
  ((select id from books where slug = 'sapiens-de-animales-a-dioses'), 'antropología'),
  ((select id from books where slug = 'el-principito'), 'clásico'),
  ((select id from books where slug = 'el-principito'), 'infantil'),
  ((select id from books where slug = 'tokio-blues'), 'contemporáneo'),
  ((select id from books where slug = 'tokio-blues'), 'japón'),
  ((select id from books where slug = '21-lecciones-siglo-xxi'), 'ensayo'),
  ((select id from books where slug = '21-lecciones-siglo-xxi'), 'contemporáneo'),
  ((select id from books where slug = 'cronica-muerte-anunciada'), 'novela corta'),
  ((select id from books where slug = 'cronica-muerte-anunciada'), 'clásico'),
  ((select id from books where slug = 'norwegian-wood'), 'contemporáneo'),
  ((select id from books where slug = 'norwegian-wood'), 'japón'),
  ((select id from books where slug = 'coronel-no-tiene-quien-le-escriba'), 'novela corta'),
  ((select id from books where slug = 'coronel-no-tiene-quien-le-escriba'), 'clásico'),
  ((select id from books where slug = 'la-casa-de-los-espiritus'), 'realismo mágico'),
  ((select id from books where slug = 'la-casa-de-los-espiritus'), 'chile'),
  ((select id from books where slug = 'ficciones'), 'cuento'),
  ((select id from books where slug = 'ficciones'), 'clásico');

insert into reviews (book_id, user_id, user_name, rating, title, content, helpful_count, created_at) values
  ((select id from books where slug = 'cien-anos-de-soledad'), null, 'María G.', 5, 'Una obra maestra atemporal',
   'Cada vez que releo este libro descubro algo nuevo. La prosa de García Márquez es simplemente mágica. Un libro que todo amante de la literatura debe tener en su estantería.',
   24, '2024-11-15'),
  ((select id from books where slug = 'cien-anos-de-soledad'), null, 'Carlos R.', 5, 'Imprescindible',
   'La forma en que García Márquez entrelaza las historias de los Buendía es magistral. Un libro que te atrapa desde la primera página y no te suelta hasta el final.',
   18, '2024-10-28'),
  ((select id from books where slug = 'cien-anos-de-soledad'), null, 'Ana M.', 4, 'Hermoso pero denso',
   'La historia es fascinante, aunque la cantidad de personajes con nombres similares puede confundir al principio. Recomiendo tener un árbol genealógico a mano.',
   12, '2024-09-12');

-- Portadas reales (archivos estáticos en public/covers)
update books set cover_image_url = '/covers/cien-anos-de-soledad.jpg' where slug = 'cien-anos-de-soledad';
update books set cover_image_url = '/covers/amor-tiempos-colera.jpg' where slug = 'amor-tiempos-colera';
update books set cover_image_url = '/covers/kafka-en-la-orilla.jpg' where slug = 'kafka-en-la-orilla';
update books set cover_image_url = '/covers/sapiens-de-animales-a-dioses.jpg' where slug = 'sapiens-de-animales-a-dioses';
update books set cover_image_url = '/covers/el-principito.jpg' where slug = 'el-principito';
update books set cover_image_url = '/covers/tokio-blues.jpg' where slug = 'tokio-blues';
update books set cover_image_url = '/covers/21-lecciones-siglo-xxi.jpg' where slug = '21-lecciones-siglo-xxi';
update books set cover_image_url = '/covers/cronica-muerte-anunciada.jpg' where slug = 'cronica-muerte-anunciada';
update books set cover_image_url = '/covers/norwegian-wood.jpg' where slug = 'norwegian-wood';
update books set cover_image_url = '/covers/coronel-no-tiene-quien-le-escriba.jpg' where slug = 'coronel-no-tiene-quien-le-escriba';
update books set cover_image_url = '/covers/la-casa-de-los-espiritus.jpg' where slug = 'la-casa-de-los-espiritus';
update books set cover_image_url = '/covers/ficciones.jpg' where slug = 'ficciones';

update book_images set url = b.cover_image_url
from books b
where book_images.book_id = b.id;

-- ---------- Usuario demo (email: demo@tuslibrosya.com / pass: Libros123) ----------
-- El hash bcrypt se genera al instalar bcryptjs (ver db/init/03_seed.sql actualizado).
insert into users (id, email, password_hash, full_name) values
  ('00000000-0000-0000-0000-000000000001', 'demo@tuslibrosya.com', '$2b$10$k6luNgX61PtPDcQTUj3BVOYtSiGRtbslTbUpNWaY19oBhA3DD/y9O', 'Usuario Demo');

insert into profiles (id, full_name) values
  ('00000000-0000-0000-0000-000000000001', 'Usuario Demo');

-- ---------- Pedidos de ejemplo para el usuario demo ----------
-- Precios en ARS (dependen de AR_USD_RATE=1300 aprox).
-- Pedido 1: 2× Cien años (paperback 19.99 USD ≈ 25.987) + 1× Ficciones (21.99 USD ≈ 28.587)
--   subtotal 80.561 + envío 7.787 + IVA 21% (16.918) = 105.266
-- Pedido 2: 1× Ficciones (28.587) + envío 7.787 + IVA 21% (6.003) = 42.377
insert into orders (id, user_id, status, subtotal, shipping, tax, total, shipping_address, created_at) values
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'pending', 80561, 7787, 16918, 105266, '{"fullName":"Usuario Demo","street":"Av. Corrientes 1234","city":"CABA","postalCode":"1043","country":"Argentina","phone":"+54 11 1234-5678"}', '2025-06-15'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'shipped', 28587, 7787, 6003, 42377, '{"fullName":"Usuario Demo","street":"Av. Corrientes 1234","city":"CABA","postalCode":"1043","country":"Argentina","phone":"+54 11 1234-5678"}', '2025-07-22');

insert into order_items (order_id, book_id, title, format, quantity, price) values
  ((select id from orders where id = '00000000-0000-0000-0000-000000000101'),
   (select id from books where slug = 'cien-anos-de-soledad'), 'Cien años de soledad', 'paperback', 2, 25987),
  ((select id from orders where id = '00000000-0000-0000-0000-000000000101'),
   (select id from books where slug = 'ficciones'), 'Ficciones', 'paperback', 1, 28587);