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
router.get('/user/:userUuid', checkRole('ADMIN'), listController.getByUserUuid)
router.delete('/user/:userUuid', checkRole('ADMIN'), listController.deleteByUserUuid)

module.exports = router