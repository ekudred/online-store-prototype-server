class userDTO {
    _id
    basket
    username
    email
    avatar
    role
    isActivated

    constructor(model) {
        this._id = model._id
        this.basket = model.basket
        this.username = model.username
        this.email = model.email
        this.avatar = model.avatar
        this.role = model.role
        this.isActivated = model.isActivated
    }
}

module.exports = userDTO