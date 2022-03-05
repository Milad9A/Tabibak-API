const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Role = require('./role_model')
const Gender = require('./gender_model')
const InvalidEmailOrPasswordError = require('../errors/invalid_email_or_password_error')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        userName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        role: {
            type: String,
            enum: Role,
            default: Role.basicUser
        },
        gender: {
            type: String,
            enum: Gender,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value))
                    throw new Error('Email is invalid')
            }
        },
        phoneNumber: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isMobilePhone(value, ['ar-SY']))
                    throw new Error(
                        'Phone number is invalid. Please enter a syrian phone number'
                    )
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            trim: true
        },
        birthDate: {
            type: Date
        },
        medicalHistory: {
            type: String,
            trim: true,
            required: true
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisarandomstring')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user)
        throw new InvalidEmailOrPasswordError('Invalid Email or Password')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
        throw new InvalidEmailOrPasswordError('Invalid Email or Password')

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)

    next()
})

// TODO: Delete user stuff when user is deleted

const User = mongoose.model('User', userSchema)

module.exports = User
