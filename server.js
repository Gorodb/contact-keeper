const express = require('express')
const connectDb = require('./config/db')
const dotenv = require('dotenv')
const sanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const morgan = require('morgan')
const errorHandler = require('./middleware/mongooseErrorsHandler')
const path = require('path')

const http = require('http')

dotenv.config({ path: './config/config.env' })

const app = express()

app.set('port', (process.env.PORT || 5000))

connectDb()

app.use(express.json({ extended: false }))

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Sanitize data
app.use(sanitize())

// Set security headers
app.use(helmet())

// Prevent xss attacks
app.use(xssClean())

// Rate limiting (100 requests per 10 minutes)
app.use(rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
}))

// Prevent http param pollution
app.use(hpp())

// Enable Cors
app.use(cors())

// Set public folder as static folder
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/contacts', require('./routes/contacts'))
app.use('/api/secret', require('./routes/clearDb'))

app.use(errorHandler)

app.get('/', (req, res) => {
    res.render('public/index.html')
})

http.createServer(app).listen(app.get('port'), () => {
    console.log(`Server started on port: ${app.get('port')}`);
})
