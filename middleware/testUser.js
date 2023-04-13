const { badRequestError } = require('../utils/CustomError')

const testUser = (req, res, next) => {
    console.log(req.user)
    if(req.user.testUser) {
        throw badRequestError('Can not perform action with test user')
    }
    next()
}   

module.exports = testUser;