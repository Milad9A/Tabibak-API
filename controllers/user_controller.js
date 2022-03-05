const User = require('../models/user_model')
const Role = require('../models/role_model')

const UserController = {
    createBasicUser: async (req, res) => {
        const body = Object.keys(req.body)

        const isValidOperation = !body.includes('role')

        if (!isValidOperation)
            return res.status(400).send({ error: 'Unable to set role' })

        try {
            const user = new User(req.body)
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({ user, token })
        } catch (error) {
            res.status(400).send(error)
        }
    },

    createAdminUser: async (req, res) => {
        const body = Object.keys(req.body)

        const isValidOperation = !body.includes('role')

        if (!isValidOperation)
            return res.status(400).send({ error: 'Unable to set role' })

        try {
            const user = new User({
                ...req.body,
                role: Role.admin
            })
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({ user, token })
        } catch (error) {
            res.status(400).send(error)
        }
    },

    loginUser: async (req, res) => {
        try {
            const user = await User.findByCredentials(
                req.body.email,
                req.body.password
            )
            if (!user)
                return res.status(401).send({
                    error: 'Invalid Email or Password'
                })

            const token = await user.generateAuthToken()

            res.send({ user, token })
        } catch (error) {
            console.log(error)
            res.status(error.status).send({ error: error.message })
        }
    },

    logoutUser: async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token
            })
            req.fcm_token = ''
            await req.user.save()
            res.send()
        } catch (error) {
            res.status(400).send()
        }
    },

    logoutUserFromAll: async (req, res) => {
        try {
            req.user.tokens = []
            await req.user.save()
            res.send()
        } catch (error) {
            res.status(400).send()
        }
    },

    getUserMe: async (req, res) => {
        res.send(req.user)
    },

    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            if (!user) return res.status(404).send()

            res.send(user)
        } catch (error) {
            res.status(400).send(error)
        }
    },

    getAllUsersPublicInfo: async (req, res) => {
        try {
            const users = await User.find({}).select({
                email: 1,
                name: 1,
                avatar: 1
            })

            res.send(users)
        } catch (error) {
            res.status(400).send(error)
        }
    },

    updateUserMe: async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = [
            'name',
            'password',
            'phoneNumber',
            'medicalHistory'
        ]
        const isValidOperation = updates.every((update) =>
            allowedUpdates.includes(update)
        )

        if (!isValidOperation)
            return res.status(400).send({ error: 'Invalid Updates' })

        try {
            updates.forEach((update) => (req.user[update] = req.body[update]))
            await req.user.save()

            res.send(req.user)
        } catch (error) {
            res.status(400).send(error)
        }
    },

    deleteUserMe: async (req, res) => {
        try {
            await req.user.remove()
            res.send(req.user)
        } catch (error) {
            res.status(400).send(error)
        }
    },

    deleteAvatarMe: async (req, res) => {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    },

    getAvatarMe: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            if (!user || !user.avatar) {
                throw new Error()
            }
            res.set('Content-Type', 'image/png')
            res.send(user.avatar)
        } catch (error) {
            res.status(404).send()
        }
    }
}

module.exports = UserController
