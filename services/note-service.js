const {Note, User} = require('../models/models')
const ApiError = require('../errors/api-error')
const userService = require('../services/user-service')

class NoteService {
    async create(refreshToken, date, content) {
        const userId = await userService.getCurrentUserId(refreshToken)
        
        const candidate = await this.get(refreshToken, date)
        if(candidate) {
            const updNote = await this.update(refreshToken, date, content)
            return updNote
        }
        
        const note = await Note.create({userId, date: this.dateFormatted(date), content})
        return note
    }

    async getByDate(refreshToken, date) {
        const note = await this.get(refreshToken, date)
        if(!note) {
            throw ApiError.BadRequest(`Note with date ${date} not found`)
        }
        return note
    }

    async getAll(refreshToken) {
        const userId = await userService.getCurrentUserId(refreshToken)
        const notes = await Note.findAll({where: {userId}})
        return notes
    }
    

    async update(refreshToken, date, content) {
        const note = await this.getByDate(refreshToken, date)
        const updNote = await note.update({content})
        return updNote
    }

    async deleteByDate(refreshToken, date) {
        const note = await this.getByDate(refreshToken, date)
        await note.destroy()
    }

    
    async get(refreshToken, date) {
        const userId = await userService.getCurrentUserId(refreshToken)
        const note = await Note.findOne({where: {userId, date: this.dateFormatted(date)}})
        return note
    }

    dateFormatted(date) {
        const dateStr = date + 'T00:00:00.000Z'
        return new Date(dateStr)
    }

// ADMIN
    async getAllData() {
        const notes = await Note.findAll()
        return notes
    }
    async getAllForUser(userId) {
        const user = await User.findOne({where: {id: userId}})
        if(!user) {
            throw ApiError.BadRequest(`User with id ${userId} not found`)
        }
        const notes = await Note.findAll({where: {userId}})
        return notes
    }
    async deleteAllForUser(userId) {
        await Note.destroy({where: {userId}})
    }
}

module.exports = new NoteService()