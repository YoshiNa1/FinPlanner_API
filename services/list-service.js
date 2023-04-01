const {List, User} = require('../models/models')
const ApiError = require('../errors/api-error')
const userService = require('../services/user-service')

class ListService {
// USER
   
    async get(refreshToken) {
        const userId = await userService.getCurrentUserId(refreshToken)
        const list = await List.findOne({where: {userId}})
        if(!list) {
            throw ApiError.BadRequest(`List for user with id ${userId} does not exists yet`)
        }
        return list
    }

    async update(refreshToken, content) {
        const userId = await userService.getCurrentUserId(refreshToken)
        var list = await List.findOne({where: {userId}})
        if(!list) {
            list = await userService.createList(userId)
        }
        const updList = await list.update({content})
        return updList
    }

// ADMIN
    async getAll() {
        const lists = await List.findAll()
        return lists
    }
    async getByUserId(userId) {
        const user = await User.findByPk(userId)
        if(!user) {
            throw ApiError.BadRequest(`User with id ${userId} not found`)
        }
        const list = await List.findOne({where: {userId}})
        if(!list) {
            throw ApiError.BadRequest(`List for user with id ${userId} does not exists yet`)
        }
        return list
    }
    async deleteByUserId(userId) { // delete when delete user from the system
        const user = await User.findByPk(userId)
        if(!user) {
            throw ApiError.BadRequest(`User with id ${userId} not found`)
        }
        await List.destroy({where: {userId}})
    }
}

module.exports = new ListService()