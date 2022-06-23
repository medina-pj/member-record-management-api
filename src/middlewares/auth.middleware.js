const jwt = require('jsonwebtoken');
const { jwtPrivateKey, authHeader } = require('../_config');

const Member = require('../models/member.model');
const Encryption = require('../_utils/encryption');

exports.authTokenForRoutes = async (req, _, next) => {
  try {
    //get token from header.
    const token = req.cookies[authHeader];
    if (!token) return next({ codeName: 'NoTokenProvided' });

    //decode token.
    const decodeToken = jwt.verify(token, jwtPrivateKey, (err, decoded) => {
      if (err) return null;
      return decoded;
    });
    if (!decodeToken) return next({ codeName: 'InvalidToken' });

    //check if user exist.
    const user = await Member.findOne({ _id: decodeToken._id, isDeleted: false });
    if (!user) return next({ codeName: 'InvalidToken' });

    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

exports.authToken = async (req, _, next) => {
  try {
    //get token from header.
    const token = req.cookies[authHeader];
    if (!token) return next({ codeName: 'NoTokenProvided' });

    //decode token.
    const decodeToken = jwt.verify(token, jwtPrivateKey, (err, decoded) => {
      if (err) return null;
      return decoded;
    });
    if (!decodeToken) return next({ codeName: 'InvalidToken' });

    //check if user exist.
    const user = await Member.findOne({
      _id: decodeToken._id,
      isDeleted: false,
    }).select('-isDeleted -isAccountApproved -__v');
    if (!user) return next({ codeName: 'InvalidToken' });

    //create token.
    const newToken = jwt.sign({ _id: user._id }, jwtPrivateKey);
    const userResponse = JSON.parse(JSON.stringify(user));

    req.user = {
      ...userResponse,
      account_info: { username: userResponse.account_info.username },
    };
    req.token = newToken;

    return next();
  } catch (error) {
    return next(error);
  }
};

exports.authUsernameAndPassword = async (req, _, next) => {
  try {
    const payload = req.body.payload;

    //check if username exist.
    const user = await Member.findOne({
      'account_info.username': payload.username,
      isDeleted: false,
    }).select('-isDeleted -__v');

    if (!user) return next({ codeName: 'NotFound' });

    //compare password.
    const passwordMatch = await Encryption.compare(payload.password, user.account_info.password, next);
    if (!passwordMatch) return next({ codeName: 'NotFound' });

    //create token.
    const token = jwt.sign({ _id: user._id }, jwtPrivateKey);

    const userResponse = JSON.parse(JSON.stringify(user));

    req.user = {
      ...userResponse,
      account_info: { username: userResponse.account_info.username },
    };
    req.token = token;

    return next();
  } catch (error) {
    return next(error);
  }
};
