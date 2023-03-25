const {Profile, User} = require('../models/models')
const ApiError = require('../errors/api-error')

class ProfileService {
    async create(userId, balance, savings, currency) {
        const user = await User.findByPk(userId)
        if(!user) {
            throw ApiError.BadRequest(`User with id ${userId} not found`)
        }
        const candidate = await Profile.findOne({where: {userId}})
        if(candidate) {
            throw ApiError.BadRequest(`Profile for user with id ${userId} already exists`)
        }
        const profile = await Profile.create({userId, balance, savings, currency})
        return profile
    }

    async get(userId) {
        const user = await User.findByPk(userId)
        if(!user) {
            throw ApiError.BadRequest(`User with id ${userId} not found`)
        }
        const profile = await Profile.findOne({where: {userId}})
        if(!profile) {
            throw ApiError.BadRequest(`User's profile wasn't created yet`)
        }
        return profile
    }

    async update(userId, balance, savings, currency) {
        const user = await User.findByPk(userId)
        if(!user) {
            throw ApiError.BadRequest(`User with id ${userId} not found`)
        }
        const profile = await Profile.findOne({where: {userId}})
        if(!profile) {
            throw ApiError.BadRequest(`User's profile wasn't created yet`)
        }
        const updProfile = await profile.update({balance, savings, currency})
        return updProfile
    }

    async delete(userId) {
        const user = await User.findByPk(userId)
        if(!user) {
            throw ApiError.BadRequest(`User with id ${userId} not found`)
        }
        await Profile.destroy({where: {userId}})
    }
}

module.exports = new ProfileService()