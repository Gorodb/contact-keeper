const { check } = require('express-validator')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const Users = require('../models/User')
const TokensBlackList = require('../models/TokensBlackList')
const TokenLinks = require('../models/TokenLinks')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../middleware/errorResponse')

// @route       POST api/users
// @desc        Register a user
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body

    let user = await Users.findOne({ email })
    if (user) {
        return next(new ErrorResponse(`Пользователь с email ${email} уже существует`, 400))
    }

    user = new Users({ name, email, password })

    await user.save()

    sendTokenResponse(user, 200, res)
})

exports.registerValidation = () => [
    check('name', 'Имя является обязательным').not().isEmpty().isLength({ max: 64 }),
    check('email', 'Пожалуйста, укажите валидный Email ').isEmail(),
    check('password', 'Пароль должен содержать не мнее 6-ти символов').isLength({ min: 6 })
]

// @desc    Get current logged in user
// @rout    GET /api/v1/auth/me
// @access   Private
exports.getMe = asyncHandler(async(req, res, next) => {
    const user = await Users.findOne({ id: req.user.id })

    res.status(200).json({ success: true, data: user })
})

// @desc    Update user details
// @rout    PUT /api/v1/auth/updateDetails
// @access   Private
exports.updateDetails = asyncHandler(async(req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    await Users.findOneAndUpdate({ id: req.user.id }, fieldsToUpdate)
    let user = await Users.findOne({ id: req.user.id })

    res.status(200).json({ success: true, data: user })
})

exports.updateDetailsValidation = () => [
    check('name', 'Имя является обязательным').not().isEmpty().isLength({ max: 64 }),
    check('email', 'Пожалуйста, укажите валидный Email ').isEmail()
]

// @desc    Auth user
// @rout    POST /api/v1/auth
// @access   public
exports.login = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorResponse('Для автризации введите email и пароль', 400))
    }

    const user = await Users.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorResponse('Пользователь с таким email и паролем не найден', 400))
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch){
        return next(new ErrorResponse('Пользователь с таким email и паролем не найден', 401))
    }

    sendTokenResponse(user, 200, res)
})

// @desc    Log user out
// @rout    POST /api/v1/auth/logout
// @access   private
exports.logout = asyncHandler(async(req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
        return next(new ErrorResponse('Вы не авторизованы', 401))
    }

    await TokensBlackList.create({
        token: token,
        expiration_date: jwt.decode(token).exp * 1000
    })

    res.status(200).json({ success: true, data: {} })
})

// @desc    Update password
// @rout    PUT /api/v1/auth/updatePassword
// @access   Private
exports.updatePassword = asyncHandler(async(req, res, next) => {
    const user = await Users.findOne({ id: req.user.id }).select('+password')

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Старый пароль не подходит', 401))
    }

    user.password = req.body.newPassword
    await user.save()

    res.status(200).json({ success: true, message: "Пароль успешно изменен" })
})

exports.updatePasswordValidation = () => [
    check('currentPassword', 'Пароль должен содержать не мнее 6-ти символов').isLength({ min: 6 }),
    check('newPassword', 'Пароль должен содержать не мнее 6-ти символов').isLength({ min: 6 })
]

// @desc    Forgot password
// @rout    POST /api/v1/auth/forgotPassword
// @access   Private
exports.forgotPassword = asyncHandler(async(req, res, next) => {
    const user = await Users.findOne({ email: req.body.email })

    if(!user) {
        return next(new ErrorResponse(`There is no user with that email`, 404))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
            To change password continue with the link: \n\n ${resetUrl}`

    try {
        if (env.NODE_ENV === 'production') {
            await sendEmail({
                email: user.email,
                subject: 'Password reset token',
                message
            })
        }
        await TokenLinks.create({email: user.email, id: user.id, resetUrl: resetUrl})
        res.status(200).json({ success: true, data: 'Email отправлен' })
    } catch (err) {
        console.log(err)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })

        return next(new ErrorResponse('Не удалось отправить email', 500))
    }
})

// @desc    Reset user's password
// @rout    PUT /api/v1/auth/resetPassword/:resetToken
// @access   Public
exports.resetPassword = asyncHandler(async(req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex')

    const user = await Users.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    console.log(user)

    if (!user) {
        return next(new ErrorResponse('Invalid token', 400))
    }

    // Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendTokenResponse(user, 200, res)
})

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode).json({ success: true, token })
}
