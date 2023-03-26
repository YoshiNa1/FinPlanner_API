const {Item, User} = require('../models/models')
const ApiError = require('../errors/api-error')
const tokenService = require('./token-service')

class ItemService {
    async create(refreshToken, type, isIncome, name, description, category, amount, currency) {
        const userId = await this.getCurrentUserId(refreshToken)
        const item = await Item.create({userId, type, isIncome, name, description, category, amount, currency})
        return item
    }

    async getAll(refreshToken) {
        const userId = await this.getCurrentUserId(refreshToken)
        const items = await Item.findAll({where: {userId}})
        return items
    }
    async getById(refreshToken, id) {
        const userId = await this.getCurrentUserId(refreshToken)
        const item = await Item.findOne({where: {userId, id}})
        if(!item) {
            throw ApiError.BadRequest(`Item with id ${id} not found`)
        }
        return item
    }

    async update(refreshToken, id, type, isIncome, name, description, category, amount, currency) {
        const item = await this.getById(refreshToken, id)
        const updProfile = await item.update({type, isIncome, name, description, category, amount, currency})
        return updProfile
    }

    async deleteById(refreshToken, id) {
        const item = await this.getById(refreshToken, id)
        await item.destroy()
    }
    
    async getCurrentUserId(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = await tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await User.findByPk(userData.id)
        if(!user) {
            throw ApiError.BadRequest(`User with id ${user.id} not found`)
        }
        return user.id
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