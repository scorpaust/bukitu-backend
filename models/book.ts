import { mongoose } from "../app";

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  image: { type: String, required: true },
  authors: { type: String, required: true },
  userIds: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
});

module.exports = mongoose.model("Book", bookSchema);
