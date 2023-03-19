const Router = require('express').Router
const router = new Router()
const userRouter = require('./user-router')

router.use('/user', userRouter)

module.exports = router
