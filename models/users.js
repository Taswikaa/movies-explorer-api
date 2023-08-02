const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const validator = require('validator');
const UnauthorizedError = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    unique: true,
    type: String,
    validate: validator.isEmail,
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUser = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcryptjs.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
