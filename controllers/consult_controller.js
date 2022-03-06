const Consult = require('../models/consult_model')
const Role = require('../models/role_model')

const ConsultController = {
    cerateConsult: async (req, res) => {
        const consult = new Consult({
            ...req.body,
            user: req.user._id
        })

        try {
            await req.user.consults.push(consult)
            await req.user.save()

            await consult.save()

            await consult.populate('user')

            res.status(201).send(consult)
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
    getAllConsults: async (req, res) => {
        try {
            const consults = await Consult.find({}, null, {
                limit:
                    req.query.limit !== undefined
                        ? parseInt(req.query.limit)
                        : 10,
                skip: parseInt(req.query.skip)
            })

            for (let index = 0; index < consults.length; index++) {
                await consults[index].populate('user')
            }

            res.send(consults)
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
    getMyConsults: async (req, res) => {
        try {
            await req.user.populate('consults')

            let consults = req.user.consults

            for (let index = 0; index < consults.length; index++) {
                await consults[index].populate('user')
            }

            res.send(consults)
        } catch (error) {
            res.status(400).send(error)
        }
    },
    getConsult: async (req, res) => {
        const _id = req.params.id

        try {
            const consult = await Consult.findById(_id)

            if (!consult) return res.status(404).send()

            if (
                !consult.user.equals(req.user._id) &&
                req.user.role !== Role.admin
            ) {
                return res.status(403).send()
            }

            await consult.populate('user')

            res.send(consult)
        } catch (error) {
            console.log(error)
            res.status(400).send()
        }
    },
    deleteConsult: async (req, res) => {
        const _id = req.params.id

        try {
            const consult = await Consult.findById(_id)

            if (!consult) return res.status(404).send()

            if (
                !consult.user.equals(req.user._id) &&
                req.user.role !== Role.admin
            ) {
                return res.status(403).send()
            }

            await Consult.findOneAndDelete({
                _id: req.params.id
            })

            const index = req.user.consults.indexOf(consult)

            if (index > -1) req.user.consults.splice(index, 1)

            await req.user.save()

            await consult.populate('user')

            res.send(consult)
        } catch (error) {
            res.status(400).send()
        }
    }
}

module.exports = ConsultController
