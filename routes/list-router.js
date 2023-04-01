const Router = require('express').Router
const router = new Router()
const listController = require('../controllers/list-controller')
const checkRole = require('../middlewares/role-middleware')
const checkProfile = require('../middlewares/profile-middleware')

//USER
router.get('/', checkProfile, listController.get)
router.put('/', checkProfile, listController.update)

//ADMIN
router.get('/all', checkRole('ADMIN'), listController.getAll)
router.get('/user/:userId', checkRole('ADMIN'), listController.getByUserId)
router.delete('/user/:userId', checkRole('ADMIN'), listController.deleteByUserId)

module.exports = router