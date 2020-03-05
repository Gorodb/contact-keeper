const express = require('express')
const { protect } = require('../middleware/auth')
const { checkErrors } = require('../middleware/validationErrors')

const {
    getContact,
    getContacts,
    createContact,
    updateContact,
    deleteContact,
    contactValidation
} = require('../controllers/contacts')

const router = express.Router()

router.use(protect)

router.route('/:id')
    .get(getContact)
    .put(contactValidation(), checkErrors, updateContact)
    .delete(deleteContact)
router.route('/')
    .get(getContacts)
    .post(contactValidation(), checkErrors, createContact)

module.exports = router