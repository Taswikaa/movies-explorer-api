require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rate-limiter');

const { PORT = 3000, NODE_ENV, DB_ID } = process.env;
const app = express();

app.use(helmet());
app.use(rateLimiter);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(`mongodb://${NODE_ENV === 'production' ? DB_ID : '127.0.0.1:27017'}/bitfilmsdb`);

app.use(requestLogger);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  const errorMessage = statusCode === 500 ? 'Ошибка на сервере' : message;

  res.status(statusCode).send({ message: errorMessage });
});

app.listen(PORT);
