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

    async getById(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const id = req.params.id
            const item = await itemService.getById(refreshToken, id)
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
            const id = req.params.id
            const {type, isIncome, name, description, 
                    category, amount, currency} = req.body
            const item = await itemService.update(refreshToken, id, 
                                                    type, isIncome, name, description, category, amount, currency)
            return res.json(item)
        } catch (e) {
            next(e)
        }
    }

    async deleteById(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const id = req.params.id
            const item = await itemService.deleteById(refreshToken, id)
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
            const userId = req.params.userId
            const items = await itemService.getAllForUser(userId)
            return res.json(items)
        } catch (e) {
            next(e)
        }
    }

    async deleteAllForUser(req, res, next) {
        try {
            const userId = req.params.userId
            const items = await itemService.deleteAllForUser(userId)
            return res.json(items)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ItemController()