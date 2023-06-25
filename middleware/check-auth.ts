const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("Falha na autenticação");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.PRIVATE_TOKEN_SECRET_KEY
    );

    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Falha na autenticaçãao!", 401);

    return next(error);
  }
};
