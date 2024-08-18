const router = require("express").Router()

const postRouter = require("./post")
const userRouter = require("./user")

router.use("/", postRouter)
router.use("/", userRouter)

module.exports = router