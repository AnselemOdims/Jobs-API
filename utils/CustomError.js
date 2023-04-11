const { StatusCodes } = require('http-status-codes');

class CustomError extends Error {
    constructor(message) {
        super(message);
    }

    badRequest = () => {
        this.statusCode = StatusCodes.BAD_REQUEST;
        return this;
    }

    unAuthorized = () => {
        this.statusCode = StatusCodes.UNAUTHORIZED;
        return this
    }

    notFound = () => {
        this.statusCode = StatusCodes.NOT_FOUND;
        return this
    }
}

const createCustomError = (msg) => {
    return new CustomError(msg)
}

const badRequestError = (msg) => createCustomError(msg).badRequest()
const unAuthorizedError = (msg) => createCustomError(msg).unAuthorized()
const notFoundError = (msg) => createCustomError(msg).notFound()

module.exports = {
    createCustomError,
    CustomError, 
    badRequestError,
    unAuthorizedError,
    notFoundError
}