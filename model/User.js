const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a user name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
      'Please provide a valid email address',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50,
    default: 'last name',
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100,
    default: 'my town',
  }
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.comparePassword = async function(pwd) {
    const compare = await bcrypt.compare(pwd, this.password)
    return compare;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
