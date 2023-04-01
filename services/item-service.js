const {Item, User} = require('../models/models')
const ApiError = require('../errors/api-error')
const userService = require('../services/user-service')

class ItemService {
    async create(refreshToken, type, isIncome, name, description, category, amount, currency) {
        const userId = await userService.getCurrentUserId(refreshToken)
        const item = await Item.create({userId, type, isIncome, name, description, category, amount, currency})
        return item
    }

    async getAll(refreshToken) {
        const userId = await userService.getCurrentUserId(refreshToken)
        const items = await Item.findAll({where: {userId}})
        return items
    }
    async getById(refreshToken, id) {
        const userId = await userService.getCurrentUserId(refreshToken)
        const item = await Item.findOne({where: {userId, id}})
        if(!item) {
            throw ApiError.BadRequest(`Item with id ${id} not found`)
        }
        return item
    }

    async update(refreshToken, id, type, isIncome, name, description, category, amount, currency) {
        const item = await this.getById(refreshToken, id)
        const updItem = await item.update({type, isIncome, name, description, category, amount, currency})
        return updItem
    }

    async deleteById(refreshToken, id) {
        const item = await this.getById(refreshToken, id)
        await item.destroy()
    }

// ADMIN
    async getAllData() {
        const items = await Item.findAll()
        return items
    }
    async getAllForUser(userId) {
        const user = await User.findOne({where: {id: userId}})
        if(!user) {
            throw ApiError.BadRequest(`User with id ${userId} not found`)
        }
        const items = await Item.findAll({where: {userId}})
        return items
    }
    async deleteAllForUser(userId) {
        await Item.destroy({where: {userId}})
    }
}

module.exports = new ItemService()