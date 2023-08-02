const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

const usersRouter = require('./users');

const moviesRouter = require('./movies');

router.use(usersRouter);

router.use(moviesRouter);

router.get('*', auth, (req, res, next) => {
  next(new NotFoundError('Рута не существует'));
});

module.exports = router;
