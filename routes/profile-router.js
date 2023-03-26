const Router = require('express').Router
const router = new Router()
const profileController = require('../controllers/profile-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const checkRole = require('../middlewares/role-middleware')

// USER
router.post('/', authMiddleware, profileController.create)
router.get('/', authMiddleware, profileController.get)
router.put('/', authMiddleware, profileController.update)
router.delete('/', authMiddleware, profileController.delete)

// ADMIN
router.get('/all', checkRole('ADMIN'), profileController.getAll)
router.get('/:userId', checkRole('ADMIN'), profileController.getProfileById)
router.delete('/:userId', checkRole('ADMIN'), profileController.deleteProfileById)

module.exports = router