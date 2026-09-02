delete from book_images bi
using book_images bi2
where bi.book_id = bi2.book_id
  and bi.url = bi2.url
  and bi.position > bi2.position;