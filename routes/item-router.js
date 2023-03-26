const Router = require('express').Router
const router = new Router()
const itemController = require('../controllers/item-controller')
const checkRole = require('../middlewares/role-middleware')
const checkProfile = require('../middlewares/profile-middleware')

//USER
router.post('/', checkProfile, itemController.create)
router.get('/all', checkProfile, itemController.getAll)
router.get('/:id', checkProfile, itemController.getById)
router.put('/:id', checkProfile, itemController.update)
router.delete('/:id', checkProfile, itemController.deleteById)

//ADMIN
router.get('/', checkRole('ADMIN'), itemController.getAllData)
router.get('/user/:userId', checkRole('ADMIN'), itemController.getAllForUser)
router.delete('/user/:userId', checkRole('ADMIN'), itemController.deleteAllForUser)

module.exports = router