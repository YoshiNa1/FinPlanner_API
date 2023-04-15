const Router = require('express').Router
const router = new Router()
const {body, param} = require('express-validator')
const userController = require('../controllers/user-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const checkRole = require('../middlewares/role-middleware')

// USER
router.post('/registration',
            body('email').isEmail(),
            body('password').isLength({min: 8, max: 32}),
            userController.registration)
router.get('/activate/:link', userController.activate)
router.get('/:email', 
            param('email').isEmail(), 
            userController.getByEmail)
router.post('/login', userController.login)
router.post('/logout', authMiddleware, userController.logout)
router.get('/refresh', authMiddleware, userController.refresh)
router.get('/', authMiddleware, userController.get)
router.delete('/', authMiddleware, userController.delete)
router.put('/changePassword',
            body('newPassword').isLength({min: 8, max: 32}),
            authMiddleware, 
            userController.changePassword)

// ADMIN
router.get('/all', checkRole('ADMIN'), userController.getAll)
router.get('/getUser/:uuid', checkRole('ADMIN'), userController.getUserByUuid)
router.delete('/delete/:uuid', checkRole('ADMIN'), userController.deleteUserByUuid)
module.exports = router