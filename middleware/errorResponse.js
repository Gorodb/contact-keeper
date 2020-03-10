class ErrorResponse extends Error {
    constructor (message, statusCode, code = 0) {
        super(message)
        this.statusCode = statusCode
        this.code = code
    }
}

module.exports = ErrorResponse
