const {List, User} = require('../models/models')
const ApiError = require('../errors/api-error')
const userService = require('../services/user-service')

class ListService {
// USER
   
    async get(refreshToken) {
        const userUuid = await userService.getCurrentUserUuid(refreshToken)
        const list = await List.findOne({where: {userUuid}})
        if(!list) {
            throw ApiError.BadRequest(`List for user with uuid ${userUuid} does not exists yet`)
        }
        return list
    }

    async update(refreshToken, content) {
        const userUuid = await userService.getCurrentUserUuid(refreshToken)
        var list = await List.findOne({where: {userUuid}})
        if(!list) {
            list = await userService.createList(userUuid)
        }
        const updList = await list.update({content})
        return updList
    }

// ADMIN
    async getAll() {
        const lists = await List.findAll()
        return lists
    }
    async getByUserUuid(userUuid) {
        const user = await User.findByPk(userUuid)
        if(!user) {
            throw ApiError.BadRequest(`User with uuid ${userUuid} not found`)
        }
        const list = await List.findOne({where: {userUuid}})
        if(!list) {
            throw ApiError.BadRequest(`List for user with uuid ${userUuid} does not exists yet`)
        }
        return list
    }
    async deleteByUserUuid(userUuid) { // delete when delete user from the system
        const user = await User.findByPk(userUuid)
        if(!user) {
            throw ApiError.BadRequest(`User with uuid ${userUuid} not found`)
        }
        await List.destroy({where: {userUuid}})
    }
}

module.exports = new ListService()