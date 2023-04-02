// dto -- data transfer object
module.exports = class UserDto {
    email
    uuid
    role
    isActivated

    constructor(model) {
        this.email = model.email
        this.uuid = model.uuid
        this.role = model.role
        this.isActivated = model.isActivated
    }
}