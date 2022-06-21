const express = require('express');
const router = express.Router();
const { authHeader, cookieOptions } = require('../_config');
const Auth = require('../middlewares/auth.middleware');

router.get('/', Auth.authToken, (req, res) => {
  const token = req.token;
  const user = req.user;
  return res.cookie(authHeader, token, cookieOptions).send({ user });
});

router.post('/', Auth.authUsernameAndPassword, (req, res) => {
  const token = req.token;
  const user = req.user;
  return res.cookie(authHeader, token, cookieOptions).send({ user });
});

router.delete('/', Auth.authTokenForRoutes, (_, res) => {
  return res.cookie(authHeader, '', cookieOptions).send();
});

module.exports = router;
