export const express = require("express");

export const bodyParser = require("body-parser");

const booksRoutes = require("./routes/books-routes");

const app = express();

app.use("/api/livros", booksRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);

  res.json({ message: error.message || "Ocorreu um erro inesperado." });
});

app.listen(5000);
