const {Profile, User} = require('../models/models')
const ApiError = require('../errors/api-error')
const userService = require('../services/user-service')

class ProfileService {
// USER
    async create(refreshToken, balance, savings, currency) {
        const userUuid = await userService.getCurrentUserUuid(refreshToken)
        const candidate = await Profile.findOne({where: {userUuid}})
        if(candidate) {
            throw ApiError.BadRequest(`Profile for user with uuid ${userUuid} already exists`)
        }
        const profile = await Profile.create({userUuid, balance, savings, currency})
        return profile
    }

    async get(refreshToken) {
        const userUuid = await userService.getCurrentUserUuid(refreshToken)
        const profile = await Profile.findOne({where: {userUuid}})
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
        const userUuid = await userService.getCurrentUserUuid(refreshToken)
        await Profile.destroy({where: {userUuid}})
    }

// ADMIN
    async getAll() {
        const profiles = await Profile.findAll()
        return profiles
    }
    async getProfileByUuid(userUuid) {
        const user = await User.findByPk(userUuid)
        if(!user) {
            throw ApiError.BadRequest(`User with uuid ${userUuid} not found`)
        }
        const profile = await Profile.findOne({where: {userUuid}})
        if(!profile) {
            throw ApiError.BadRequest(`User's profile wasn't created yet`)
        }
        return profile
    }
    async deleteProfileByUuid(userUuid) {
        const user = await User.findByPk(userUuid)
        if(!user) {
            throw ApiError.BadRequest(`User with uuid ${userUuid} not found`)
        }
        await Profile.destroy({where: {userUuid}})
    }
}

module.exports = new ProfileService()