const Router = require('express').Router
const router = new Router()
const userRouter = require('./user-router')
const profileRouter = require('./profile-router')
const itemRouter = require('./item-router')

router.use('/user', userRouter)
router.use('/profile', profileRouter) // check auth/check if role admin
router.use('/item', itemRouter) // check profile with auth/check if role admin

module.exports = router
