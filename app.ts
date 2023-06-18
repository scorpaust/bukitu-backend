export const express = require("express");

export const bodyParser = require("body-parser");

export const { check, validationResult } = require("express-validator");

export const mongoose = require("mongoose");

import "dotenv/config";

const HttpError = require("./models/http-error");

const booksRoutes = require("./routes/books-routes");

const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

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

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
