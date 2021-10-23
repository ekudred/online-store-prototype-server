module.exports = class ErrorAPI extends Error {
    status
    errors

    constructor(status, message, errors = []) {
        super(message)

        this.status = status
        this.message = message
        this.errors = errors
    }

    static badRequest(message, errors = []) {
        return new ErrorAPI(400, message, errors)
    }
    
    static unAuthError() {
        return new ErrorAPI(401, 'Пользователь не найден')
    }

    static forbidden() {
        return new ErrorAPI(403, 'Нет доступа')
    }

}