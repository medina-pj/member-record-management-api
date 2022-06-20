const { mongodb_uri } = require('../_config');
const mongoose = require('mongoose');

module.exports = function () {
  mongoose
    .connect(mongodb_uri)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));
};
