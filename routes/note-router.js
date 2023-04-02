const Router = require('express').Router
const router = new Router()
const noteController = require('../controllers/note-controller')
const checkRole = require('../middlewares/role-middleware')
const checkProfile = require('../middlewares/profile-middleware')

//USER
router.post('/', checkProfile, noteController.create)
router.get('/', checkProfile, noteController.getAll)
router.get('/:date', checkProfile, noteController.getByDate)
router.put('/:date', checkProfile, noteController.update)
router.delete('/:date', checkProfile, noteController.deleteByDate)

//ADMIN
router.get('/all', checkRole('ADMIN'), noteController.getAllData)
router.get('/user/:userUuid', checkRole('ADMIN'), noteController.getAllForUser)
router.delete('/user/:userUuid', checkRole('ADMIN'), noteController.deleteAllForUser)

module.exports = router