const {User, List} = require('../models/models')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../errors/api-error')

class UserService {

// USER
    async registration(email, password, role) {
        const candidate = await User.findOne({where: {email}})//.catch((e) => console.log(e))
        if(candidate) {
            throw ApiError.BadRequest(`User with email ${email} is already exists`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()
        
        const user = await User.create({email, role, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`)
        
        const userDto = new UserDto(user) // for payload, have only four fields: uuid, email, role, isActivated
        const tokens = tokenService.generateTokens({...userDto}) // ... it's spread-operator, when you return object
        await tokenService.saveToken(userDto.uuid, tokens.refreshToken)

        await this.createList(userDto.uuid)

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
       
        await tokenService.saveToken(userDto.uuid, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }
    
    async get(refreshToken) {
        const user = await this.getCurrentUser(refreshToken)
        const userDto = new UserDto(user)
        return userDto
    }

    async refresh(refreshToken) {
        const userDto = await this.get(refreshToken)
        const tokens = tokenService.generateTokens({...userDto})
       
        await tokenService.saveToken(userDto.uuid, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }

    async changePassword(refreshToken, oldPassword, newPassword) {
        const user = await this.getCurrentUser(refreshToken)
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
       
        await tokenService.saveToken(userDto.uuid, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }
    

    async delete(refreshToken) {
        const user = await this.getCurrentUser(refreshToken)
        const userDto = new UserDto(user)

        await User.destroy({where: {id: user.uuid}})
        
        return userDto
    }

    async getCurrentUser(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = await tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await User.findByPk(userData.uuid)
        if(!user) {
            throw ApiError.BadRequest(`User with uuid ${user.uuid} not found`)
        }
        return user
    }

    async getCurrentUserUuid(refreshToken) {
        const user = await this.getCurrentUser(refreshToken)
        return user.uuid
    }

    async createList(userUuid) { // creating after registration
        const candidate = await List.findOne({where: {userUuid}})
        if(candidate) {
            throw ApiError.BadRequest(`List for user with uuid ${userUuid} already exists`)
        }
        const list = await List.create({userUuid, content: new Array()})
        return list
    }
    
// ADMIN
    async getAll() {
        const users = await User.findAll()
        return users
    }

    async getUserByUuid(uuid) {
        const user = await User.findByPk(uuid)
        if(!user) {
            throw ApiError.BadRequest(`User with uuid ${uuid} not found`)
        }
        return user
    }

    async deleteUserByUuid(uuid) {
        const user = await User.findByPk(uuid)
        const userDto = new UserDto(user)

        await User.destroy({where: {uuid}})
        
        return userDto
    }
}

module.exports = new UserService()