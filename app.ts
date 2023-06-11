export const express = require("express");

export const bodyParser = require("body-parser");

const HttpError = require("./models/http-error");

const booksRoutes = require("./routes/books-routes");

const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/livros", booksRoutes);

app.use("/api/utilizadores", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Ligação não encontrada", 404);

  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);

  res.json({ message: error.message || "Ocorreu um erro inesperado." });
});

app.listen(5000);
