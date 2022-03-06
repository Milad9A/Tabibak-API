const Subject = require('../models/subject_model')

const SubjectController = {
    createSubject: async (req, res) => {
        const subject = new Subject({
            ...req.body,
            user: req.user._id
        })

        try {
            await req.user.subjects.push(subject)
            await req.user.save()
            await subject.save()
            await subject.populate('user')

            res.status(201).send(subject)
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    getAllSubjects: async (req, res) => {
        try {
            const subjects = await Subject.find({}, null, {
                limit:
                    req.query.limit !== undefined
                        ? parseInt(req.query.limit)
                        : 10,
                skip: parseInt(req.query.skip)
            })

            let id
            if (req.user) id = req.user._id

            for (let index = 0; index < subjects.length; index++) {
                await subjects[index].populate('user')
            }

            res.send(subjects)
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
    getSubject: async (req, res) => {
        const _id = req.params.id

        try {
            const subject = await Subject.findById(_id)

            if (!subject) return res.status(404).send()

            await subject.populate('user')

            res.send(subject)
        } catch (error) {
            console.log(error)
            res.status(400).send()
        }
    },
    updateSubject: async (req, res) => {
        const updates = Object.keys(req.body)

        try {
            const subject = await Subject.findById(req.params.id)

            if (!subject) return res.status(404).send()

            updates.forEach((update) => (subject[update] = req.body[update]))

            await subject.save()
            await subject.populate('user')

            res.send(subject)
        } catch (error) {
            res.status(400).send(error)
        }
    },
    deleteSubject: async (req, res) => {
        try {
            const subject = await Subject.findOneAndDelete({
                _id: req.params.id
            })

            if (!subject) return res.status(404).send()

            const index = req.user.subjects.indexOf(subject)

            if (index > -1) req.user.subjects.splice(index, 1)

            await req.user.save()

            await subject.populate('user')

            res.send(subject)
        } catch (error) {
            res.status(400).send()
        }
    }
}

module.exports = SubjectController
