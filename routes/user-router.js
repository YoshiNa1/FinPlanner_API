const Router = require('express').Router
const router = new Router()
const {body} = require('express-validator')
const userController = require('../controllers/user-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const checkRole = require('../middlewares/role-middleware')

// USER
router.post('/registration',
            body('email').isEmail(),
            body('password').isLength({min: 8, max: 32}),
            userController.registration)
router.get('/activate/:link', userController.activate)
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
router.get('/getUser/:id', checkRole('ADMIN'), userController.getUserById)
router.delete('/delete/:id', checkRole('ADMIN'), userController.deleteUserById)
module.exports = router