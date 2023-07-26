const Movie = require('../models/movies');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    owner: req.user._id,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => res.status(201).send(movie))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (movie) {
        if (!(req.user._id === movie.owner._id.toString())) {
          throw new ForbiddenError('Нельзя удалять чужие сохранённые фильмы');
        }

        Movie.findByIdAndRemove(req.params._id)
          .then((deletedMovie) => res.send(deletedMovie))
          .catch(next);
      } else {
        throw new NotFoundError('Фильм с указанным id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Фильм с указанным id не найден'));
      }

      return next(err);
    });
};
