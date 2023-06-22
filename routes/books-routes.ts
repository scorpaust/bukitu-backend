import { express } from "../app";
import { check } from "../app";

const booksController = require("../controllers/books-controller");

const router = express.Router();

const fileUpload = require("../middleware/file-upload");

router.get("/:lid", booksController.getBookById);

router.get("/utilizador/:uid", booksController.getBooksByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("summary").isLength({ min: 5 }),
    check("authors").not().isEmpty(),
  ],
  booksController.createBook
);

router.patch(
  "/:lid",
  [
    check("title").not().isEmpty(),
    check("summary").isLength({ min: 5 }),
    check("authors").not().isEmpty(),
  ],
  booksController.updateBookById
);

router.delete("/:lid", booksController.deleteBookById);

module.exports = router;
