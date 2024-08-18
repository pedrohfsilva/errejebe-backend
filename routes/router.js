const router = require("express").Router()

const commentRouter = require("./comment")
const postRouter = require("./post")

router.use("/", commentRouter)
router.use("/", postRouter)

module.exports = router