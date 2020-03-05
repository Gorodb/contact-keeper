const jwt = require('jsonwebtoken')

const asyncHandler = require('./async')
const errorResponse = require('./errorResponse')
const Users = require('../models/User')
const TokensBlackList = require('../models/TokensBlackList')

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    // Make sure token exists
    if (!token) {
        return next(new errorResponse('Нет доступа к ресурсу, необходима авторизация', 401))
    }

    // Check for token not in black list
    const isInBlackList = await TokensBlackList.findOne({token})
    if (isInBlackList) {
        return next(new errorResponse('Нет доступа к ресурсу, необходима авторизация', 401))
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await Users.findById(decoded.id)

        if (req.user === null) {
            return next(new errorResponse('Нет доступа к ресурсу, необходима авторизация', 401))
        }
        next()
    } catch (err) {
        return next(new errorResponse('Нет доступа к ресурсу, необходима авторизация', 401))
    }
})

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new errorResponse(`Пользователи с ролью '${req.user.role}' не имеют доступа к ресурсу`, 403))
        }
        next()
    }
}
