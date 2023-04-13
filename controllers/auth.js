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
    throw unAuthorizedError('Email/Password incorrect');
  }
  const isPassword = await user.comparePassword(password);
  console.log(isPassword)
  if (!isPassword) {
    throw unAuthorizedError('Email/Password incorrect');
  }
  const token = user.generateToken();
  res.status(StatusCodes.OK).json({
    code: '00',
    msg: 'Logged in successfully',
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
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
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location} = req.body;
  const { id, testUser } = req.user;
  if(testUser) return res.send('User  can not perform operation')
  if(!email || !name || !lastName || !location) {
    throw badRequestError('Please provide all fields')
  }
  const user = await User.findByIdAndUpdate({ _id: id}, {
    name,
    email,
    lastName,
    location
  },
  { new: true, runValidators: true }
  )

  const token = user.generateToken();
  res.status(StatusCodes.OK).json({
    code: '00',
    msg: 'User returned successfully',
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token,
    },
  });
}

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({
    code: '00',
    message: 'All users retrieved successfully',
    data: users,
    length: users.length,
  });
}

const deleteUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findByIdAndDelete({ _id: id })
  if (!user) {
    throw notFoundError(`No user with id ${id}`);
  }
  res.status(StatusCodes.OK).json({
    code: '00',
    message: 'User deleted successfully',
    deletedUser: user
  })
}
module.exports = {
  login,
  register,
  updateUser,
  getUsers,
  deleteUser
};
