const Router = require('express').Router
const router = new Router()
const itemController = require('../controllers/item-controller')
const checkRole = require('../middlewares/role-middleware')
const checkProfile = require('../middlewares/profile-middleware')

//USER
router.post('/', checkProfile, itemController.create)
router.get('/', checkProfile, itemController.getAll)
router.get('/:uuid', checkProfile, itemController.getByUuid)
router.put('/:uuid', checkProfile, itemController.update)
router.delete('/:uuid', checkProfile, itemController.deleteByUuid)

//ADMIN
router.get('/all', checkRole('ADMIN'), itemController.getAllData)
router.get('/user/:userUuid', checkRole('ADMIN'), itemController.getAllForUser)
router.delete('/user/:userUuid', checkRole('ADMIN'), itemController.deleteAllForUser)

module.exports = router