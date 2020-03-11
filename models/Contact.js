const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const Schema = mongoose.Schema

const ContactSchema = new Schema({
    user_id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    type: {
        type: String,
        default: 'personal'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    virtuals: true,
    versionKey: false
})

ContactSchema.options.toJSON.transform = function (doc, ret, options) {
    delete ret.createdAt
    delete ret.updatedAt
    delete ret._id
}

autoIncrement.initialize(mongoose.connection)
ContactSchema.plugin(autoIncrement.plugin, {
    model: 'Contacts',
    field: 'id',
    startAt: 1
})

ContactSchema.pre('save', async function (next) {
    console.log('pre saving data')
    next()
})

module.exports = mongoose.model('Contacts', ContactSchema)