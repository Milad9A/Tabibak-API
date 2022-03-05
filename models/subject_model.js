const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String,
            default:
                'https://www.expatica.com/app/uploads/sites/3/2020/11/doctors-netherlands.jpg'
        },
        body: {
            type: String,
            required: true,
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
)

const Subject = mongoose.model('Subject', subjectSchema)

module.exports = Subject
