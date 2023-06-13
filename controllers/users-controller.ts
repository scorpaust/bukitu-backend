import { v4 as uuidv4 } from "uuid";
import { validationResult } from "../app";

const HttpError = require("../models/http-error");

const User = require("../models/user");

const dummy_users = [
  {
    id: "u1",
    name: "Dinis Costa",
    email: "test@test.com",
    password: "1234",
  },
];

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Falha na listagem de utilizadores. Tente, por favor, mais tarde.",
      500
    );

    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Dados inválidos. Verifique se preencheu corretamente todos os campos do formulário.",
        422
      )
    );
  }

  const { name, email, image, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("O registo falhou. Tente mais tarde.", 500);

    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "Não foi possível registar utilizador. E-mail já registado na nossa base de dados.",
      422
    );

    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image,
    password,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Não foi possível proceder ao registo de utilizador na base de dados. Tente, por favor, mais tarde.",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("O registo falhou. Tente mais tarde.", 500);

    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Credenciais inválidas. Falha na autenticação.",
      401
    );

    return next(error);
  }

  res.json({ message: "Autenticação bem sucedida!" });
};

exports.getUsers = getUsers;

exports.signUp = signUp;

exports.login = login;
