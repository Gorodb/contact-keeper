const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')
const asyncHandler = require('./middleware/async')
const Users = require('./models/User')
const Contact = require('./models/Contact')

const randomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min

dotenv.config({ path: './config/config.env' })

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

// Read JSON files
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))

// Import into DB
const importData = async () => {
    try {
        await Users.create(users)
        const contactsIds = await Users.find()
        await contactsIds.map(async user => {
            const names = ['Jill', 'Samanta', 'Mickel Smith', 'Peater McCennon', 'Allison Teilor']
            const contacts = names.reduce((acc, name) => [...acc, {
                "type": Math.random() > 0.5 ? "professional" : "personal",
                "name": name,
                "email": `${name.replace(/\s+/g, '')}@gmail.com`,
                "phone": `${randomInt(1, 9)}(${randomInt(100, 999)})${randomInt(1000000, 9999999)}`,
                "user_id": user.id
            }], [])
            try {
                await Contact.insertMany(contacts)
            } catch (e) {
                console.error(e.red)
            }
        })
        console.log(`Data imported...`.green.inverse)
        process.exit()
    } catch (e) {
        console.error(e.red)
    }
}

// Delete data
const deleteData = async () => {
    try {
        await Contact.deleteMany()
        await Users.deleteMany()
        console.log(`Deleting data...`.red.inverse)
        process.exit()
    } catch (e) {
        console.error(e.red)
    }
}

(async () => {
    if (process.argv[2] === '-i') {
        await importData()
    } else if (process.argv[2] === '-d') {
        await deleteData()
    }
})()
