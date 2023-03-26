const profileService = require('../services/profile-service')

class ProfileController {

// USER
    async create(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const {balance, savings, currency} = req.body
            const profile = await profileService.create(refreshToken, balance, savings, currency)
            return res.json(profile)
        } catch (e) {
            next(e)
        }
    }

    async get(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const profile = await profileService.get(refreshToken)
            return res.json(profile)
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const {balance, savings, currency} = req.body
            const profile = await profileService.update(refreshToken, balance, savings, currency)
            return res.json(profile)
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const profile = await profileService.delete(refreshToken)
            return res.json(profile)
        } catch (e) {
            next(e)
        }
    }

// ADMIN
    async getAll(req, res, next) {
        try {
            const profile = await profileService.getAll()
            return res.json(profile)
        } catch (e) {
            next(e)
        }
    }
    async getProfileById(req, res, next) {
        try {
            const userId = req.params.userId
            const profile = await profileService.getProfileById(userId)
            return res.json(profile)
        } catch (e) {
            next(e)
        }
    }
    async deleteProfileById(req, res, next) {
        try {
            const userId = req.params.userId
            const profile = await profileService.getProfileById(userId)
            return res.json(profile)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new ProfileController()