import { v4 as uuidv4 } from "uuid";

const HttpError = require("../models/http-error");

const dummy_users = [
  {
    id: "u1",
    name: "Dinis Costa",
    email: "test@test.com",
    password: "1234",
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: dummy_users });
};

const signUp = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = dummy_users.find((u) => u.email === email);

  if (hasUser) {
    throw new HttpError(
      "Não foi possível registar utilizador. E-mail já registado na nossa base de dados.",
      422
    );
  }

  const createdUser = {
    id: uuidv4(),
    name: name,
    email: email,
    password: password,
  };

  dummy_users.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = dummy_users.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Credenciais inválidas.", 401);
  }

  res.json({ message: "Autenticação bem sucedida!" });
};

exports.getUsers = getUsers;

exports.signUp = signUp;

exports.login = login;
