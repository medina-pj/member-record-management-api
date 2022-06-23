module.exports = function (app) {
  app.use('/api/v1/auth', require('./auth.route'));
  app.use('/api/v1/members', require('./member.route'));
};
