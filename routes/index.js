const Router = require('express').Router
const router = new Router()
const userRouter = require('./user-router')
const profileRouter = require('./profile-router')
const itemRouter = require('./item-router')
const noteRouter = require('./note-router')
const listRouter = require('./list-router')

router.use('/user', userRouter)
router.use('/profile', profileRouter) // check auth/check if role admin
router.use('/item', itemRouter) // check profile with auth/check if role admin
router.use('/note', noteRouter) // check profile with auth/check if role admin
router.use('/list', listRouter) // check profile with auth/check if role admin

module.exports = router
