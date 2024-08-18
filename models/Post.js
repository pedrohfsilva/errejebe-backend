const mongoose = require("mongoose");

const { Schema } = mongoose;

const { commentSchema } = require("./Comment.js");

const postSchema = new Schema(
  {
    userId: {
      type: String,
      required: true, // Correção aqui
    },
    image: {
      type: String,
      required: false, // Correção aqui
    },
    text: {
      type: String,
      required: true, // Correção aqui
    },
    likes: {
      type: Number,
      default: 0, // Definindo valor padrão
      required: false, // Correção aqui
    },
    comments: {
      type: [commentSchema],
      default: [],
      required: false, // Correção aqui
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
