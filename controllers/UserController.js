const UserService = require('../services/UserService')

class UserController {
    async getUsers(req, res, next) {
        try {
            // const { skip, limit } = req.body
            const users = await UserService.find({ ...req.body })
            const totalLength = await UserService.getTotalLength()

            res.json({ users, totalLength })
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()