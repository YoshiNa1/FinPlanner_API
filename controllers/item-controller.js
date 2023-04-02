const itemService = require('../services/item-service')

class ItemController {
    async create(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const {type, isIncome, name, description, 
                    category, amount, currency} = req.body
            const item = await itemService.create(refreshToken, type, isIncome, name, description, 
                                                                category, amount, currency)
            return res.json(item)
        } catch (e) {
            next(e)
        }
    }

    async getByUuid(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const uuid = req.params.uuid
            const item = await itemService.getByUuid(refreshToken, uuid)
            return res.json(item)
        } catch (e) {
            next(e)
        }
    }
    
    async getAll(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const item = await itemService.getAll(refreshToken)
            return res.json(item)
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const uuid = req.params.uuid
            const {type, isIncome, name, description, 
                    category, amount, currency} = req.body
            const item = await itemService.update(refreshToken, uuid, 
                                                    type, isIncome, name, description, category, amount, currency)
            return res.json(item)
        } catch (e) {
            next(e)
        }
    }

    async deleteByUuid(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const uuid = req.params.uuid
            const item = await itemService.deleteByUuid(refreshToken, uuid)
            return res.json(item)
        } catch (e) {
            next(e)
        }
    }
    
    //ADMIN
    async getAllData(req, res, next) {
        try {
            const items = await itemService.getAllData()
            return res.json(items)
        } catch (e) {
            next(e)
        }
    }

    async getAllForUser(req, res, next) {
        try {
            const userUuid = req.params.userUuid
            const items = await itemService.getAllForUser(userUuid)
            return res.json(items)
        } catch (e) {
            next(e)
        }
    }

    async deleteAllForUser(req, res, next) {
        try {
            const userUuid = req.params.userUuid
            const items = await itemService.deleteAllForUser(userUuid)
            return res.json(items)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ItemController()