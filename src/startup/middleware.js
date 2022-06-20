const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

module.exports = function (app) {
  app.use(express.json());

  app.use(cookieParser());

  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      allowedHeaders: ['Content-Type'],
    })
  );
};
