const Role = require('../models/role_model')

const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== Role.admin) {
            throw new Error()
        }

        next()
    } catch (e) {
        res.status(403).send({ error: 'User is not an admin' })
    }
}

module.exports = isAdmin
