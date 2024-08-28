const PostModel = require("../models/Post")

const postController = {
  create: async(req, res) => {
    try {
      const post = {
        userId: req.body.userId,
        image: req.body.image,
        text: req.body.text
      }

      const response = await PostModel.create(post)

      res.status(201).json({response, msg: "Post criado com sucesso."})
    } catch (error) {
      console.log(error)
    }
  },
  getAll: async(req, res) => {
    try {
      const posts = await PostModel.find().sort({ createdAt: -1 });
      res.json(posts)
    } catch (error) {
      console.log(error)
    }
  },
  get: async(req, res) => {
    try {
      const id = req.params.id
      const post = await PostModel.findById(id)

      if(!post) {
        res.status(404).json({msg: "Post não encontrado."})
        return
      }

      res.json(post)
    } catch (error) {
      console.log(error)
    }
  },
  getPostsByUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const posts = await PostModel.find({ userId: userId }).sort({ createdAt: -1 });;

      res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  delete: async(req, res) => {
    try {
      const id = req.params.id
      const post = await PostModel.findById(id)

      if(!post) {
        res.status(404).json({msg: "Post não encontrado."})
        return
      }

      const deletedPost = await PostModel.findByIdAndDelete(id)

      res.status(200).json({deletedPost, msg: "Post excluído com sucesso."})
    } catch (error) {
      console.log(error)
    }
  },
  update: async(req, res) => {
    const id = req.params.id
    const post = {
      userId: req.body.userId,
      image: req.body.image,
      text: req.body.text
    }

    const updatedPost = await PostModel.findByIdAndUpdate(id, post, { new: true })

    if(!updatedPost) {
      res.status(404).json({msg: "Post não encontrado."})
      return
    }

    res.status(200).json({updatedPost, msg: "Post atualizado com sucesso."})
  },
  addComment: async(req, res) => {
    const id = req.params.id
    const comment = {
      userId: req.body.userId,
      text: req.body.text,
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );

    if(!updatedPost) {
      res.status(404).json({msg: "Post não encontrado."})
      return
    }

    res.status(200).json({updatedPost, msg: "Comentário adicionado com sucesso."})
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
  }
}

module.exports = postController