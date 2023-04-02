const listService = require('../services/list-service')

class ListController {

// USER

    async get(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const list = await listService.get(refreshToken)
            return res.json(list)
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const {content} = req.body
            const list = await listService.update(refreshToken, content)
            return res.json(list)
        } catch (e) {
            next(e)
        }
    }
    
// ADMIN
    async getAll(req, res, next) {
        try {
            const lists = await listService.getAll()
            return res.json(lists)
        } catch (e) {
            next(e)
        }
    }
    async getByUserUuid(req, res, next) {
        try {
            const userUuid = req.params.userUuid
            const list = await listService.geByUserUuid(userUuid)
            return res.json(list)
        } catch (e) {
            next(e)
        }
    }
    async deleteByUserUuid(req, res, next) {
        try {
            const userUuid = req.params.userUuid
            const list = await listService.deleteByUserUuid(userUuid)
            return res.json(list)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new ListController()