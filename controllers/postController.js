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

      res.status(201).json({response, msg: "Post criado com sucesso!"})
    } catch (error) {
      console.log(error)
    }
  },
  getAll: async(req, res) => {
    try {
      const posts = await PostModel.find()
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
  delete: async(req, res) => {
    try {
      const id = req.params.id
      const post = await PostModel.findById(id)

      if(!post) {
        res.status(404).json({msg: "Post não encontrado."})
        return
      }

      const deletedPost = await PostModel.findByIdAndDelete(id)

      res.status(200).json({deletedPost, msg: "Post excluído com sucesso!"})
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

    const updatedPost = await PostModel.findByIdAndUpdate(id, post)

    if(!updatedPost) {
      res.status(404).json({msg: "Post não encontrado."})
      return
    }

    res.status(200).json({updatedPost, msg: "Post atualizado com sucesso."})
  }
}

module.exports = postController