const { check } = require('express-validator')

const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../middleware/errorResponse')
const Contacts = require('../models/Contact')

// @route       GET api/contacts/:id
// @desc        Get a contact
// @access      Private
exports.getContact = asyncHandler(async (req, res, next) => {
    const contact = await Contacts.findOne({ id: req.params.id })

    if (!contact) {
        return next(new ErrorResponse(`Контакт с id ${req.params.id} не найден`, 404))
    }

    res.status(200).json({ success: true, data: contact })
})

// @route       GET api/contacts
// @desc        Get all user's contacts
// @access      Private
exports.getContacts = asyncHandler(async (req, res, next) => {
    const contacts = await Contacts.find({ user_id: req.user.id }).sort({ date: -1 })

    res.status(200).json({ success: true, contacts })
})

// @route       POST api/contacts
// @desc        Create a contact
// @access      Private
exports.createContact = asyncHandler(async (req, res, next) => {
    const { name, email, phone, type } = req.body

    const newContact = new Contacts({ name, email, phone, type, user_id: req.user.id })

    const contact = await newContact.save()

    res.status(200).json({ success: true, data: contact })
})

// @route       PUT api/contacts
// @desc        Update a contact
// @access      Private
exports.updateContact = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = { name, email, phone, type } = req.body

    let contact = await Contacts.findOneAndUpdate({ id: req.params.id }, fieldsToUpdate)

    if (!contact) {
        return next(new ErrorResponse(`Контакт с id ${req.params.id} не найден`, 404))
    }

    contact = await Contacts.findOne({ id: req.params.id })

    res.status(200).json({ success: true, data: contact })
})

// @route       DELETE api/contacts
// @desc        Delete a contact
// @access      Private
exports.deleteContact = asyncHandler(async (req, res, next) => {
    const contact = await Contacts.findOneAndDelete({ id: req.params.id })

    if (!contact) {
        return next(new ErrorResponse(`Контакт с id ${req.params.id} не найден`, 404))
    }

    res.status(200).json({ success: true, data: null })
})

exports.contactValidation = () => [
    check('name', 'Пожалуйста, укажите имя контакта').not().isEmpty().isLength({ max: 64 })
]
