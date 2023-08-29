const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcryptjs.hash(password, 10)
    .then((hash) => {
      User.create({ name, email, password: hash })
        .then((user) => res.status(201).send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Данные для создания пользователя переданы неверно'));
          }

          if (err.code === 11000) {
            return next(new ConflictError('Эта почта уже используется'));
          }

          return next(err);
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'key', {
        expiresIn: '7d',
      });

      res.cookie('jwt', token, {
        maxAge: 86400000,
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        domain: 'https://yuwarika.nomoreparties.co',
      });

      res.send(token);
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt', {
    sameSite: 'None',
    secure: true,
    domain: 'https://yuwarika.nomoreparties.co',
  });
  res.status(200).send('Вы успешно вышли');
};
