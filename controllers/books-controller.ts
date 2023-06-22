import { v4 as uuidv4 } from "uuid";
import { mongoose, validationResult } from "../app";
const fs = require("fs");

const HttpError = require("../models/http-error");

const Book = require("../models/book");

const User = require("../models/user");

const getBookById = async (req, res, next) => {
  const bookId = req.params.lid;

  let book;

  try {
    book = await Book.findById(bookId);
  } catch (err) {
    const error = new HttpError(
      "Não foi possível encontrar um livro com id " + bookId,
      500
    );
    return next(error);
  }

  if (!book) {
    const error = new HttpError(
      "Não foi encontrado nenhum livro com id " + bookId,
      404
    );

    return next(error);
  }

  res.json({ book: book.toObject({ getters: true }) });
};

const getBooksByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let books;

  try {
    books = await Book.find({ userIds: userId });
  } catch (err) {
    const error = new HttpError(
      "Não foram encontrados livros para o utilizador com id " + userId,
      500
    );

    return next(error);
  }

  if (!books || books.length == 0) {
    return next(
      new HttpError(
        "Não foi encontrado nenhum livro para o utilizador " + userId,
        404
      )
    );
  }

  console.log("booksOut " + books);

  res.json({
    books: books.map((book) => book.toObject({ getters: true })),
  });
};

const createBook = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Dados inválidos. Verifique se preencheu corretamente todos os campos do formulário.",
        422
      )
    );
  }

  const { title, summary, authors, userId } = req.body;

  const createdBook = new Book({
    title,
    summary,
    image: req.file.path,
    authors,
    userIds: [userId],
  });

  let user;

  try {
    user = await User.findById({ _id: userId });
  } catch (err) {
    const error = new HttpError("Falha na criação de livro.", 500);

    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Não foi encontrado utilizador com id " + userId,
      404
    );

    return next(error);
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    await createdBook.save({
      session: sess,
    });

    user.books.push(createdBook);

    await user.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Falhou a criação de um novo livro.", 500);

    return next(error);
  }

  res.status(201).json({ book: createdBook });
};

const updateBookById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Dados inválidos. Verifique se preencheu corretamente todos os campos do formulário.",
        422
      )
    );
  }

  const { title, summary, authors } = req.body;
  const bookId = req.params.lid;

  let book;

  try {
    book = await Book.findById(bookId);
  } catch (err) {
    const error = new HttpError(
      "Não foi possível atualizar o livro com id " + bookId,
      500
    );

    return next(error);
  }

  book.title = title;

  book.summary = summary;

  book.authors = authors;

  try {
    await book.save();
  } catch (err) {
    const error = new HttpError(
      "Não foi possível guardar na base de dados o livro com id " + bookId,
      500
    );
    return next(error);
  }

  res.status(200).json({ book: book.toObject({ getters: true }) });
};

const deleteBookById = async (req, res, next) => {
  const bookId = req.params.lid;

  let book;

  try {
    book = await Book.findById(bookId).populate("userIds");
  } catch (err) {
    const error = new HttpError(
      "Não foi possível eliminar o livro com id " + bookId,
      500
    );
    return next(error);
  }

  if (!book) {
    const error = new HttpError(
      "Não foi possível encontrar um livro com id " + bookId,
      404
    );

    return next(error);
  }

  const imagePath = book.image;

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    book.userIds.forEach(async (id) => {
      let user = await User.findById(id);

      user.books.pull(book);

      await user.save();

      book.userIds.pull(user);
    });

    await book.deleteOne({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Não foi possível remover da base de dados o livro com id " + bookId,
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.error(err);
  });

  res.status(200).json({ message: "Livro eliminado da sua coleção." });
};

exports.getBookById = getBookById;

exports.getBooksByUserId = getBooksByUserId;

exports.createBook = createBook;

exports.updateBookById = updateBookById;

exports.deleteBookById = deleteBookById;
