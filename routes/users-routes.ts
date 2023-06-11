import { express } from "../app";

const usersController = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post("/registar", usersController.signUp);

router.post("/entrar", usersController.login);

module.exports = router;
