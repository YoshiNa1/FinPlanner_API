const {User} = require('../models/models')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../errors/api-error')

class UserService {
    async registration(email, password, role) {
        const candidate = await User.findOne({where: {email}})//.catch((e) => console.log(e))
        if(candidate) {
            throw ApiError.BadRequest(`User with email ${email} is already exists`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()
        
        const user = await User.create({email, role, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`)
        
        const userDto = new UserDto(user) // for payload, have only four fields: id, email, role, isActivated
        const tokens = tokenService.generateTokens({...userDto}) // ... it's spread-operator, when you return object
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, // разворачивание объекта
                user: userDto }
    }

    async activate(activationLink) {
        const user = await User.findOne({where: {activationLink}})
        if(!user) {
            throw ApiError.BadRequest('Invalid activation link')
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        const user = await User.findOne({where: {email}})
        if(!user) {
            throw ApiError.BadRequest(`User with email ${email} not found`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) {
            throw ApiError.BadRequest(`Incorrect password`)
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
       
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = await tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await User.findByPk(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
       
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }

    async getAllUsers() {
        const users = await User.findAll()
        return users
    }

    async getUser(id) {
        const user = await User.findByPk(id)
        if(!user) {
            throw ApiError.BadRequest(`User with id ${id} not found`)
        }
        return user
    }

    async delete(id) {
        const user = await User.findByPk(id)
        const userDto = new UserDto(user)

        await User.destroy({where: {id}})
        
        return userDto
    }

    async changePassword(refreshToken, oldPassword, newPassword) {
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
            throw ApiError.BadRequest(`User with email ${userData.email} not found`)
        }
        
        const isPassEquals = await bcrypt.compare(oldPassword, user.password)
        if(!isPassEquals) {
            throw ApiError.BadRequest(`Incorrect password`)
        }
        
        const hashNewPassword = await bcrypt.hash(newPassword, 3)
        const updateUser = await user.update({password: hashNewPassword})
        if(!updateUser) {
            throw ApiError.Internal('Change password failed')
        }

        const userDto = new UserDto(updateUser)
        const tokens = tokenService.generateTokens({...userDto})
       
        await mailService.sendPasswordChangedMail(userDto.email)
       
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }
}

module.exports = new UserService()