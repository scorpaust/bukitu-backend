import { v4 as uuidv4 } from "uuid";
import { validationResult } from "../app";

const HttpError = require("../models/http-error");

let dummy_books = [
  {
    id: "b1",
    isbn: "9781501137259",
    title: "O Enigma das Sombras",
    summary:
      "Num mundo onde a escuridão possui poderes misteriosos, um jovem aprendiz embarca em uma busca perigosa para descobrir a verdade por trás das sombras enigmáticas. Conforme segredos são revelados, ele percebe que seu destino está entrelaçado com o destino de todo o reino.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Shadowman-3.jpg/220px-Shadowman-3.jpg",
    author: "Amelia Harper",
    userIds: ["u1"],
  },
  {
    id: "b2",
    isbn: "0738531367",
    title: "Ecos na Eternidade",
    summary:
      "Ambientado em um futuro distópico, um músico talentoso descobre uma melodia escondida que detém a chave para restaurar a harmonia em uma sociedade arruinada. Junto a um grupo de rebeldes, ela precisa confrontar o regime opressor e reacender a esperança em um mundo à beira do colapso.",
    image:
      "https://static.livrariaespirita.org.br/media/catalog/product/cache/1/image/450x/17f82f742ffe127f42dca9de82fb58b1/e/c/ecos-na-eternidade.jpg",
    author: "Sebastian Mitchell",
    userIds: ["u1"],
  },
  {
    id: "b3",
    isbn: "0738531367",
    title: "O Reino Esquecido",
    summary:
      "Em uma terra governada por magia antiga e lendas esquecidas, uma jovem guerreira se ergue para reconquistar seu trono legítimo. Com um grupo de companheiros leais, ela embarca em uma jornada perigosa, enfrentando criaturas míticas e forças sombrias que ameaçam mergulhar o reino em uma escuridão eterna.",
    image:
      "https://static.fnac-static.com/multimedia/Images/PT/MC/59/b9/90/9484633/1507-1/tsp20230117231550/O-Reino-Esquecido-Arqueologia-E-Historia-De-Israel.jpg",
    author: "Gabriella Knight",
    userIds: ["u1"],
  },
];

const getBookById = (req, res, next) => {
  const bookId = req.params.lid;
  const book = dummy_books.find((b) => {
    return b.id === bookId;
  });

  if (!book) {
    throw new HttpError(
      "Não foi encontrado nenhum livro com id " + bookId,
      404
    );
  }

  res.json({ book });
};

const getBooksByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const books = dummy_books.filter((b) => {
    return b.userIds.includes(userId);
  });

  if (!books || books.length == 0) {
    return next(
      new HttpError(
        "Não foi encontrado nenhum livro para o utilizador " + userId,
        404
      )
    );
  }

  res.json({ books });
};

const createBook = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError(
      "Dados inválidos. Verifique se preencheu corretamente todos os campos do formulário.",
      422
    );
  }

  const { isbn, title, summary, image, author } = req.body;
  const createdBook = {
    id: uuidv4(),
    isbn: isbn,
    title: title,
    summary: summary,
    image: image,
    author: author,
    userIds: ["u1"],
  };

  dummy_books.push(createdBook);

  res.status(201).json({ book: createdBook });
};

const updateBookById = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError(
      "Dados inválidos. Verifique se preencheu corretamente todos os campos do formulário.",
      422
    );
  }

  const { title, summary } = req.body;
  const bookId = req.params.lid;

  const updatedBook = { ...dummy_books.find((b) => b.id === bookId) };

  const bookIndex = dummy_books.findIndex((b) => b.id === bookId);

  updatedBook.title = title;

  updatedBook.summary = summary;

  dummy_books[bookIndex] = updatedBook;

  res.status(200).json({ book: updatedBook });
};

const deleteBookById = (req, res, next) => {
  const bookId = req.params.lid;

  if (!dummy_books.find((b) => b.id === bookId)) {
    throw new HttpError(
      "Não foi encontrado nenhum livro com id " + bookId + ".",
      404
    );
  }

  dummy_books = dummy_books.filter((b) => b.id !== bookId);

  res.status(200).json({ message: "Livro eliminado da sua coleção." });
};

exports.getBookById = getBookById;

exports.getBooksByUserId = getBooksByUserId;

exports.createBook = createBook;

exports.updateBookById = updateBookById;

exports.deleteBookById = deleteBookById;
