const express = require('express')

const { protect } = require('../middleware/auth')
const { checkErrors } = require('../middleware/validationErrors')

const {
    register, registerValidation,
    updatePassword, updatePasswordValidation,
    updateDetails, updateDetailsValidation,
    forgotPassword,
    resetPassword
} = require('../controllers/users')

const router = express.Router()

router.route('/').post(registerValidation(), checkErrors, register)
router.route('/updateDetails').put(updateDetailsValidation(), checkErrors, protect, updateDetails)
router.route('/updatePassword').put(updatePasswordValidation(), checkErrors, protect, updatePassword)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:resetToken').put(resetPassword)

module.exports = router