const express = require("express");
const booksController = require("../controllers/books-controller");

const router = express.Router();

router.get("/:lid", booksController.getBookById);

router.get("/utilizador/:uid", booksController.getBooksByUserId);

router.post("/", booksController.createBook);

router.patch("/:lid", booksController.updateBookById);

router.delete("/:lid", booksController.deleteBookById);

module.exports = router;
