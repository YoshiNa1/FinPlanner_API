const {Item, User} = require('../models/models')
const ApiError = require('../errors/api-error')
const userService = require('../services/user-service')

class ItemService {
    async create(refreshToken, type, isIncome, name, description, category, amount, currency) {
        const userUuid = await userService.getCurrentUserUuid(refreshToken)
        const item = await Item.create({userUuid, type, isIncome, name, description, category, amount, currency})
        return item
    }

    async getAll(refreshToken) {
        const userUuid = await userService.getCurrentUserUuid(refreshToken)
        const items = await Item.findAll({where: {userUuid}})
        return items
    }
    async getByUuid(refreshToken, uuid) {
        const userUuid = await userService.getCurrentUserUuid(refreshToken)
        const item = await Item.findOne({where: {userUuid, uuid}})
        if(!item) {
            throw ApiError.BadRequest(`Item with uuid ${uuid} not found`)
        }
        return item
    }

    async update(refreshToken, uuid, type, isIncome, name, description, category, amount, currency) {
        const item = await this.getByUuid(refreshToken, uuid)
        const updItem = await item.update({type, isIncome, name, description, category, amount, currency})
        return updItem
    }

    async deleteByUuid(refreshToken, uuid) {
        const item = await this.getByUuid(refreshToken, uuid)
        await item.destroy()
    }

// ADMIN
    async getAllData() {
        const items = await Item.findAll()
        return items
    }
    async getAllForUser(userUuid) {
        const user = await User.findOne({where: {id: userUuid}})
        if(!user) {
            throw ApiError.BadRequest(`User with uuid ${userUuid} not found`)
        }
        const items = await Item.findAll({where: {userUuid}})
        return items
    }
    async deleteAllForUser(userUuid) {
        await Item.destroy({where: {userUuid}})
    }
}

module.exports = new ItemService()