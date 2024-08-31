const PostModel = require("../models/Post");
const fs = require('fs');

const postController = {
  create: async (req, res) => {
    try {
      const file = req.file;
      const { userId, text } = req.body;

      const imageSrc = file ? file.path : null;

      const post = {
        user: userId,
        text: text,
        imageSrc: imageSrc,
      };

      const response = await PostModel.create(post);

      res.status(201).json({ response, msg: "Post criado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao criar post." });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const { userId, text } = req.body;
      const file = req.file;

      const post = await PostModel.findById(id);

      if (!post) {
        res.status(404).json({ msg: "Post não encontrado." });
        return;
      }

      if (file) {
        if (post.imageSrc) {
          fs.unlinkSync(post.imageSrc);
        }
        post.imageSrc = file.path;
      }

      post.text = text;
      post.user = userId;

      const updatedPost = await post.save();

      res.status(200).json({ updatedPost, msg: "Post atualizado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao atualizar post." });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;

      const post = await PostModel.findById(id);

      if (!post) {
        res.status(404).json({ msg: "Post não encontrado." });
        return;
      }

      if (post.imageSrc) {
        fs.unlinkSync(post.imageSrc);
      }

      await PostModel.findByIdAndDelete(id);

      res.status(200).json({ msg: "Post excluído com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao excluir post." });
    }
  },

  getAll: async (req, res) => {
    try {
      const posts = await PostModel.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name positionCompany imageSrc');

      res.json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Erro ao buscar os posts.' });
    }
  },

  get: async (req, res) => {
    try {
      const id = req.params.id;
      const post = await PostModel.findById(id).populate('user', 'name positionCompany imageSrc');

      if (!post) {
        res.status(404).json({ msg: "Post não encontrado." });
        return;
      }

      res.json(post);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao buscar post." });
    }
  },

  getPostsByUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const posts = await PostModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('user', 'name positionCompany imageSrc');

      res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  toggleLike: async (req, res) => {
    try {
      const id = req.params.id;
      const userId = req.body.userId;

      const post = await PostModel.findById(id);

      if (!post) {
        res.status(404).json({ msg: "Post não encontrado." });
        return;
      }

      const likeIndex = post.likes.indexOf(userId);

      if (likeIndex !== -1) {
        post.likes.splice(likeIndex, 1);
      } else {
        post.likes.push(userId);
      }

      const updatedPost = await post.save();

      res.status(200).json({ updatedPost, msg: "Likes alterado com sucesso." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = postController;