import { express } from "../app";
import { check } from "../app";

const booksController = require("../controllers/books-controller");

const router = express.Router();

router.get("/:lid", booksController.getBookById);

router.get("/utilizador/:uid", booksController.getBooksByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("summary").isLength({ min: 5 }),
    check("image").not().isEmpty(),
    check("author").not().isEmpty(),
  ],
  booksController.createBook
);

router.patch(
  "/:lid",
  [check("title").not().isEmpty(), check("summary").isLength({ min: 5 })],
  booksController.updateBookById
);

router.delete("/:lid", booksController.deleteBookById);

module.exports = router;
