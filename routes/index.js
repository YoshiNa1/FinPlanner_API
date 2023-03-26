const Router = require('express').Router
const router = new Router()
const authMiddleware = require('../middlewares/auth-middleware')
const userRouter = require('./user-router')
const profileRouter = require('./profile-router')
const itemRouter = require('./item-router')

router.use('/user', userRouter)
router.use('/profile', authMiddleware, profileRouter) //TODO: check auth/check if role admin
router.use('/item', itemRouter) // check profile with auth/check if role admin

module.exports = router
