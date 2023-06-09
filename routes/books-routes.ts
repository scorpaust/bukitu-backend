const express = require("express");

const httpError = require("../models/http-error");

const router = express.Router();

const dummy_books = [
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

router.get("/:lid", (req, res, next) => {
  const bookId = req.params.lid;
  const book = dummy_books.find((b) => {
    return b.id === bookId;
  });

  if (!book) {
    throw new httpError(
      "Não foi encontrado nenhum livro com id " + bookId,
      404
    );
  }

  res.json({ book });
});

router.get("/utilizador/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const books = dummy_books.filter((b) => {
    return b.userIds.includes(userId);
  });

  if (books.length == 0) {
    return next(
      new httpError(
        "Não foi encontrado nenhum livro para o utilizador " + userId,
        404
      )
    );
  }

  res.json({ books });
});

module.exports = router;
