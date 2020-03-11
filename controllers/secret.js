const asyncHandler = require('../middleware/async')
const Contacts = require('../models/Contact')
const Users = require('../models/User')

exports.clearDataBase = asyncHandler(async (req, res, next) => {
    await Contacts.deleteMany()
    await Users.deleteMany()
    res.status(200).json({success: true})
})
