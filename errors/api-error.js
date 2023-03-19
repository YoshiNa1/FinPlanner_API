module.exports = class ApiError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.message = message
    }
    
    static Internal(message) {
        return new ApiError(500, message)
    }
    
    static Forbidden(message) {
        return new ApiError(403, message)
    }

    static UnauthorizedError() { // static func can be used without creating class object
        return new ApiError(401, 'The user is not authorized')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }
}
