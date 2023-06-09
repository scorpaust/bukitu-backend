const express = require("express");
const booksController = require("../controllers/books-controller");

const router = express.Router();

router.get("/:lid", booksController.getBookById);

router.get("/utilizador/:uid", booksController.getBooksByUserId);

module.exports = router;
