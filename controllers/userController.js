const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
require('dotenv').config();

const userController = {
  register: async (req, res) => {
    try {
      const { name, photo, positionCompany, email, password } = req.body;

      // Verifica se o email já está em uso
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email já está em uso." });
      }

      // Criptografa a senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Cria o novo usuário
      const newUser = new UserModel({
        name,
        photo,
        positionCompany,
        email,
        password: hashedPassword,
      });

      const response = await newUser.save();
      res.status(201).json({ response, msg: "Usuário criado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao registrar usuário." });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Verifica se o usuário existe
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
      }

      // Verifica a senha
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Senha incorreta." });
      }

      // Cria o token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({ token, msg: "Login realizado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao realizar login." });
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await UserModel.find().sort({ name: 1 });
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  },

  get: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await UserModel.findById(id);

      if (!user) {
        res.status(404).json({ msg: "Usuário não encontrado." });
        return;
      }

      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao buscar usuário." });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await UserModel.findById(id);

      if (!user) {
        res.status(404).json({ msg: "Usuário não encontrado." });
        return;
      }

      const deleteUser = await UserModel.findByIdAndDelete(id);

      res.status(200).json({ deleteUser, msg: "Usuário excluído com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao excluir usuário." });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, photo, positionCompany, email, password } = req.body;

      // Criptografa a nova senha, se fornecida
      let hashedPassword = password;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        {
          name,
          photo,
          positionCompany,
          email,
          password: hashedPassword,
        },
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ msg: "Usuário não encontrado." });
        return;
      }

      res.status(200).json({ updatedUser, msg: "Usuário atualizado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao atualizar usuário." });
    }
  },
};

module.exports = userController;
