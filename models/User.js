const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const env = process.env
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Пожалуйста, введите email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Пожалуйста, введите пароль. '],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    virtuals: true,
    versionKey: false
})

UserSchema.options.toJSON.transform = function (doc, ret, options) {
    delete ret.resetPasswordToken
    delete ret.resetPasswordExpire
    delete ret.createdAt
    delete ret.updatedAt
    delete ret._id
}

autoIncrement.initialize(mongoose.connection)
UserSchema.plugin(autoIncrement.plugin, {
    model: 'Users',
    field: 'id',
    startAt: 1
})

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.static('cryptPassword', async function(password) {
    return bcrypt.hash(password, await bcrypt.genSalt(10))
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRE }
    )
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}


// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    // Set expire
    this.resetPasswordExpire = Date.now() + parseInt(env.FORGOT_TOKEN_EXPIRE, 10) * 60 * 1000

    return resetToken
}

module.exports = mongoose.model('Users', UserSchema)
