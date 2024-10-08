const mongoose = require("mongoose")

const { Schema } = mongoose

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    imageSrc: {
      type: String,
      require: false,
    },
    positionCompany: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    expoPushToken: {
      type: String,
      require: false,
    }
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)

module.exports = User