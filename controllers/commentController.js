const PostModel = require("../models/Comment")

const commentController = {
  create: async(req, res) => {
    try {
      const comment = {
        user: req.body.userId,
        postId: req.body.postId,
        text: req.body.text
      }

      const response = await PostModel.create(comment)

      res.status(201).json({response, msg: "Comentário criado com sucesso."})
    } catch (error) {
      console.log(error)
    }
  },
  getAll: async(req, res) => {
    try {
      const comments = await PostModel.find().sort({ createdAt: -1 }).populate('user', 'name imageSrc')
      res.json(comments)
    } catch (error) {
      console.log(error)
    }
  },
  get: async(req, res) => {
    try {
      const id = req.params.id
      const comment = await PostModel.findById(id).populate('user', 'name imageSrc')

      if(!comment) {
        res.status(404).json({msg: "Comentário não encontrado."})
        return
      }

      res.json(comment)
    } catch (error) {
      console.log(error)
    }
  },
  getCommentsByPost: async (req, res) => {
    try {
      const postId = req.params.postId;
      const comments = await PostModel.find({ postId: postId }).sort({ createdAt: -1 }).populate('user', 'name imageSrc')

      res.status(200).json(comments);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  getCommentsByUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const comments = await PostModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('user', 'name imageSrc')

      res.status(200).json(comments);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  delete: async(req, res) => {
    try {
      const id = req.params.id
      const comment = await PostModel.findById(id)

      if(!comment) {
        res.status(404).json({msg: "Comentário não encontrado."})
        return
      }

      const deletedComment = await PostModel.findByIdAndDelete(id)

      res.status(200).json({deletedComment, msg: "Post excluído com sucesso."})
    } catch (error) {
      console.log(error)
    }
  },
  update: async(req, res) => {
    const id = req.params.id
    const comment = {
      user: req.body.userId,
      postId: req.body.postId,
      text: req.body.text
    }

    const updatedComment = await PostModel.findByIdAndUpdate(id, comment, { new: true })

    if(!updatedComment) {
      res.status(404).json({msg: "Comentário não encontrado."})
      return
    }

    res.status(200).json({updatedComment, msg: "Comentário atualizado com sucesso."})
  },
}

module.exports = commentController