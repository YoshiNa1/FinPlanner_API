const Router = require('express').Router
const router = new Router()
const profileController = require('../controllers/profile-controller')

// //AUTH
// router.post('/', profileController.create)
// router.get('/', profileController.get)
// router.put('/', profileController.update)
// router.delete('/', profileController.delete)
// // ADMIN
// router.get('/:userId', checkRole('ADMIN'), profileController.getUserById)
// router.delete('/:userId', checkRole('ADMIN'), profileController.delete)

router.post('/', profileController.create)
router.get('/:userId', profileController.get)
router.put('/', profileController.update)
router.delete('/:userId', profileController.delete) //checkRole('ADMIN') ?
module.exports = router