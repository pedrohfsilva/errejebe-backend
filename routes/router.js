const router = require("express").Router()

const postRouter = require("./post")
const commentRouter = require("./comment")
const userRouter = require("./user")

router.use("/", postRouter)
router.use("/", commentRouter)
router.use("/", userRouter)

module.exports = router