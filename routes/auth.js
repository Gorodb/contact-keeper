const express = require('express')

const { protect } = require('../middleware/auth')
const { login, logout, getMe } = require('../controllers/users')

const router = express.Router()

router.route('/me').get(protect, getMe)
router.route('/login').post(login)
router.route('/logout').post(protect, logout)

module.exports = router