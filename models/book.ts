import { mongoose } from "../app";

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  image: { type: String, required: true },
  authors: { type: Array, required: true },
  userIds: { type: Array, required: true },
});

module.exports = mongoose.model("Book", bookSchema);
