const { unAuthorizedError } = require('../utils/CustomError');
const jwt = require('jsonwebtoken');

const authMiddleWare = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    throw unAuthorizedError('Unauthorized user');
  }
  const token = auth.split(' ')[1];
  try {
    const verifiedUser = await jwt.verify(token, process.env.JWT_SECRET);
    const testUser = verifiedUser.userId === '6436945189b28063dcdeed3a';
    req.user = {
      id: verifiedUser.userId,
      name: verifiedUser.name,
      email: verifiedUser.email,
      testUser
    };
    next();
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = authMiddleWare;
