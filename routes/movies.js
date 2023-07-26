const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', auth, getMovies);

router.post('/movies', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().required(),
    trailerLink: Joi.string().uri().required(),
    thumbnail: Joi.string().uri().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/movies/:_id', auth, celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().required(),
  }),
}), deleteMovie);

module.exports = router;
