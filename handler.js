const { nanoid } = require('nanoid');

// untuk mengimpor berkas
const books = require('./books');

// POST
const addBookHandler = (request, h) => {
  // kode ini untuk client
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // nanoid berfungsi untuk membuat id yang unik
  const id = nanoid(16);
  // properti untuk server
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  // memasukkan nilai
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    insertedAt,
    readPage,
    updatedAt,
    finished,
    reading,
  };

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',

    });
    response.code(400);
    return response;
  } // } punya siapa?

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// GET
const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;
  let newBook = books;
  if (name !== undefined) {
    newBook = newBook.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  };
  if (reading !== undefined){
    newBook = newBook.filter((book) => book.reading === (reading == 1))
  };
  if (finished !== undefined){
    newBook = newBook.filter((book) => book.finished === (finished == 1))
  };

  const response = h.response({
    status: 'success',
    data: {
      // books,
      books: newBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// GET ID
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0];
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
  // if (book !== undefined) {
    // const response = h.response({
  //   status: 'fail',
  //   message: 'Buku tidak ditemukan',
  // });
  // response.code(404);
  // return response;
    // const isSuccess = books.filter((b) => b.id === bookId).length > 0;
    // if (isSuccess) {
    // const response = h.response({
    //   status: 'success',
    //   data: { book },
    //   });
    //   response.code(200);
    //   return response;
    // }
    
  // }

  // const isSuccess = books.filter((b) => b.id === bookId).length > 0;
  // if (isSuccess) {
  //   const response = h.response({
  //     status: 'success',
  //     data: { book: books.filter((b) => b.id === bookId)[0] },
  //   });
  //   response.code(200);
  //   return response;
  // }
  


// PUT
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updateAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    if (name === undefined) {
    // books.push(books);
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    const finished = (readPage === pageCount);
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      finished,
      reading,
      readPage,
      updateAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// DELETE
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // if (bookId !== undefined) {

  // }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler, 
};