const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');

const User = require('../model/User');
const { badRequestError, unAuthorizedError } = require('../utils/CustomError');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw badRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw unAuthorizedError('Unauthorized user');
  }
  const isPassword = await user.comparePassword(password)
  if (!isPassword) {
    throw unAuthorizedError('Unauthorized user');
  }
  const token = user.generateToken();
  res.status(StatusCodes.OK).json({
    code: '00',
    msg: 'Logged in successfully',
    data: {
      name: user.name,
      token,
    },
  });
};

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.generateToken();
  res.status(StatusCodes.CREATED).json({
    code: '00',
    msg: 'User created successfully',
    data: { name: user.name, token },
  });
};

module.exports = {
  login,
  register,
};
