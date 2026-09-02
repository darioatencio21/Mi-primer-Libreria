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