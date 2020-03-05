const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const env = process.env

const TokenLinksSchema = new mongoose.Schema({
    resetUrl: String,
    email: String,
    id: Number,
    expirationDate: {
        type: String,
        default: Date.now() + env.FORGOT_TOKEN_EXPIRE*60*1000
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: env.FORGOT_TOKEN_EXPIRE*60
    }
}, { timestamps: true, versionKey: false })

// TokenLinksSchema.index({createdAt: Date.now},{expireAfterSeconds: env.FORGOT_TOKEN_EXPIRE*60})
autoIncrement.initialize(mongoose.connection)
TokenLinksSchema.plugin(autoIncrement.plugin, {
    model: 'TokenLInks',
    field: 'id',
    startAt: 1
})

module.exports = mongoose.model('TokenLInks', TokenLinksSchema)
