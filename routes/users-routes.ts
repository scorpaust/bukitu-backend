import { express } from "../app";
import { check } from "../app";

const usersController = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
  "/registar",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signUp
);

router.post("/entrar", usersController.login);

module.exports = router;
