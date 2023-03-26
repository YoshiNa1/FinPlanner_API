const {Profile, User} = require('../models/models')
const ApiError = require('../errors/api-error')
const userService = require('../services/user-service')

class ProfileService {
// USER
    async create(refreshToken, balance, savings, currency) {
        const userId = await userService.getCurrentUserId(refreshToken)
        const candidate = await Profile.findOne({where: {userId}})
        if(candidate) {
            throw ApiError.BadRequest(`Profile for user with id ${userId} already exists`)
        }
        const profile = await Profile.create({userId, balance, savings, currency})
        return profile
    }

    async get(refreshToken) {
        const userId = await userService.getCurrentUserId(refreshToken)
        const profile = await Profile.findOne({where: {userId}})
        if(!profile) {
            throw ApiError.BadRequest(`User's profile wasn't created yet`)
        }
        return profile
    }

    async update(refreshToken, balance, savings, currency) {
        const profile = await this.get(refreshToken)
        const updProfile = await profile.update({balance, savings, currency})
        return updProfile
    }

    async delete(refreshToken) {
        const userId = await userService.getCurrentUserId(refreshToken)
        await Profile.destroy({where: {userId}})
    }

// ADMIN
    async getAll() {
        const profiles = await Profile.findAll()
        return profiles
    }
    async getProfileById(userId) {
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
    async deleteProfileById(userId) {
        const user = await User.findByPk(userId)
        if(!user) {
            throw ApiError.BadRequest(`User with id ${userId} not found`)
        }
        await Profile.destroy({where: {userId}})
    }
}

module.exports = new ProfileService()