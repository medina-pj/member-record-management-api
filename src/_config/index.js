const dotenv = require('dotenv');
dotenv.config();

const cookieOptions =
  process.env.NODE_ENV === 'production'
    ? {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, //24h
      }
    : {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //24h
      };

module.exports = {
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  idSecretKey: process.env.ID_TOKEN_SECRET,
  apiSecretKey: process.env.API_SECRET,
  mongodb_uri: process.env.MONGODB_URI,
  authHeader: process.env.AUTH_HEADER,
  aws_access_key: process.env.AWS_ACCESS_KEY,
  aws_secret_key: process.env.AWS_SECRET_KEY,
  aws_bucket_name: process.env.AWS_BUCKET_NAME,
  cookieOptions,
};
