const mongoose = require('mongoose')

const TokensBlackListSchema = new mongoose.Schema({
    token: String,
    expiration_date: Date,
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: parseInt(process.env.JWT_EXPIRE, 10)*60*60*24 // seconds
    }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('TokensBlackList', TokensBlackListSchema)
