const userService = require('../services/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../errors/api-error')

const d30 = 30 * 24 * 60 * 60 * 1000

class UserController {
// USER
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation Error', errors.array()))
            }
            const {email, password, role} = req.body
            const userData = await userService.registration(email, password, role)
            
            res.cookie('refreshToken', userData.refreshToken, {maxAge: d30, httpOnly: true}) // httpOnly says that this cookie can't be modified from browser
            return res.json(userData)
        } catch (e) {
            next(e) // error-middleware
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: d30, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            
            res.cookie('refreshToken', userData.refreshToken, {maxAge: d30, httpOnly: true})
            return res.json(userData)

        } catch (e) {
            next(e)
        }
    }

    async get(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const user = await userService.get(refreshToken)
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const user = await userService.delete(refreshToken)
            return res.json({message: `User ${user.email} was succesfully deleted`})
        } catch (e) {
            next(e)
        }
    }

    async changePassword(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const {oldPassword, newPassword} = req.body
            const userData = await userService.changePassword(refreshToken, oldPassword, newPassword)
            
            res.cookie('refreshToken', userData.refreshToken, {maxAge: d30, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

// ADMIN
    async getAll(req, res, next) {
        try {
            const users = await userService.getAll()
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }
    
    async getUserById(req, res, next) {
        try {
            const id = req.params.id
            const user = await userService.getUserById(id)
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async deleteUserById(req, res, next) {
        try {
            const id = req.params.id
            const user = await userService.deleteUserById(id)
            return res.json({message: `User ${user.email} was succesfully deleted`})
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new UserController()