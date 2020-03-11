const express = require('express')

const { clearDataBase } = require('../controllers/secret')

const router = express.Router()

router.route('/clear').post(clearDataBase)

module.exports = router