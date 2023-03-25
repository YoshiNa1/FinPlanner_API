const Router = require('express').Router
const router = new Router()
const profileController = require('../controllers/profile-controller')

router.post('/', profileController.create)
router.get('/:userId', profileController.get)
router.put('/', profileController.update)
router.delete('/:userId', profileController.delete) //checkRole('ADMIN') ?
module.exports = router