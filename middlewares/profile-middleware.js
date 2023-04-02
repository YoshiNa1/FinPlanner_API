const ApiError = require('../errors/api-error')
const tokenService = require('../services/token-service')
const {Profile} = require('../models/models')

module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }
        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }

        const profile = await Profile.findOne({where: {userUuid: userData.uuid}})
        if(!profile) {
            return next(ApiError.Forbidden(`User's profile wasn't created yet`))
        }

        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}