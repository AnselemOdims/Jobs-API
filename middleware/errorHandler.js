const { CustomError } = require('../utils/CustomError');

const errorHandler = (err, req, res, next) => {
    if(err instanceof CustomError) {
        res.status(err.statusCode).json({ code: '99', err: err, msg: err.message})
    } else {
        res.status(500).json({ code: '99', err })
    }
}

module.exports = errorHandler;