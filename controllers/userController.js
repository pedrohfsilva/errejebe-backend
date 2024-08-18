const UserModel = require("../models/User")

const userController = {
  create: async(req, res) => {
    try {
      const user = {
        name: req.body.name,
        photo: req.body.photo,
        positionCompany: req.body.positionCompany,
        email: req.body.email,
        password: req.body.password,
      }

      const response = await UserModel.create(user)

      res.status(201).json({response, msg: "Usuário criado com sucesso."})
    } catch (error) {
      console.log(error)
    }
  },
  getAll: async(req, res) => {
    try {
      const users = await UserModel.find()
      res.json(users)
    } catch (error) {
      console.log(error)
    }
  },
  get: async(req, res) => {
    try {
      const id = req.params.id
      const user = await UserModel.findById(id)

      if(!user) {
        res.status(404).json({msg: "Usuário não encontrado."})
        return
      }

      res.json(user)
    } catch (error) {
      console.log(error)
    }
  },
  delete: async(req, res) => {
    try {
      const id = req.params.id
      const user = await UserModel.findById(id)

      if(!user) {
        res.status(404).json({msg: "Usuário não encontrado."})
        return
      }

      const deleteUser = await UserModel.findByIdAndDelete(id)

      res.status(200).json({deleteUser, msg: "Usuário excluído com sucesso."})
    } catch (error) {
      console.log(error)
    }
  },
  update: async(req, res) => {
    const id = req.params.id
    const user = {
      name: req.body.name,
      photo: req.body.photo,
      positionCompany: req.body.positionCompany,
      email: req.body.email,
      password: req.body.password,
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, user, { new: true })

    if(!updatedUser) {
      res.status(404).json({msg: "Usuário não encontrado."})
      return
    }

    res.status(200).json({updatedUser, msg: "Usuário atualizado com sucesso."})
  },
}

module.exports = userController