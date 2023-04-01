const noteService = require('../services/note-service')

class NoteController {
    async create(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const {date, content} = req.body
            const note = await noteService.create(refreshToken, date, content)
            return res.json(note)
        } catch (e) {
            next(e)
        }
    }

    async getByDate(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const date = req.params.date
            const note = await noteService.getByDate(refreshToken, date)
            return res.json(note)
        } catch (e) {
            next(e)
        }
    }
    
    async getAll(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const note = await noteService.getAll(refreshToken)
            return res.json(note)
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const date = req.params.date
            const {content} = req.body
            const note = await noteService.update(refreshToken, date, content)
            return res.json(note)
        } catch (e) {
            next(e)
        }
    }

    async deleteByDate(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const date = req.params.date
            const note = await noteService.deleteByDate(refreshToken, date)
            return res.json(note)
        } catch (e) {
            next(e)
        }
    }
    
    //ADMIN
    async getAllData(req, res, next) {
        try {
            const notes = await noteService.getAllData()
            return res.json(notes)
        } catch (e) {
            next(e)
        }
    }

    async getAllForUser(req, res, next) {
        try {
            const userId = req.params.userId
            const notes = await noteService.getAllForUser(userId)
            return res.json(notes)
        } catch (e) {
            next(e)
        }
    }

    async deleteAllForUser(req, res, next) {
        try {
            const userId = req.params.userId
            const notes = await noteService.deleteAllForUser(userId)
            return res.json(notes)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new NoteController()