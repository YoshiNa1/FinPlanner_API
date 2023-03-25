const profileService = require('../services/profile-service')

class ProfileController {
    async create(req, res, next) {
        try {
            const {userId, balance, savings, currency} = req.body
            const profile = await profileService.create(userId, balance, savings, currency)
            return res.json(profile)
        } catch (e) {
            next(e)
        }
    }

    async get(req, res, next) {
        try {
            const userId = req.params.userId
            const profile = await profileService.get(userId)
            return res.json(profile)
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            const {userId, balance, savings, currency} = req.body
            const profile = await profileService.update(userId, balance, savings, currency)
            return res.json(profile)
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const userId = req.params.userId
            const profile = await profileService.delete(userId)
            return res.json(profile)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new ProfileController()