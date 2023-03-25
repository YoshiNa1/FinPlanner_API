const Router = require('express').Router
const router = new Router()
const authMiddleware = require('../middlewares/auth-middleware')
const userRouter = require('./user-router')
const profileRouter = require('./profile-router')

router.use('/user', userRouter)
router.use('/profile', authMiddleware, profileRouter)

module.exports = router
