module.exports = (err, _, res, __) => {
  console.log(err);

  const isDuplicateKey = err.name === 'MongoServerError' && err.code === 11000;
  const isValidationError = err.name === 'ValidationError';

  if (isDuplicateKey) {
    return res.status(409).send('Duplicate Key!');
  } else if (isValidationError) {
    return res.status(400).send('Validation Error!');
  } else if (err.codeName) {
    switch (err.codeName) {
      case 'InvalidAccount':
        return res.status(400).send('Username/password must be more than 5 characters!');

      case 'NotFound':
        return res.status(404).send('Not Found!');

      case 'DuplicateKey':
        return res.status(409).send('Duplicate Key!');

      case 'DuplicateData':
        return res.status(409).send('Duplicate Data!');

      case 'NoTokenProvided':
        return res.status(401).send('No Token Provided!');

      case 'InvalidToken':
        return res.status(401).send('Invalid Token!');

      case 'NotAuthorized':
        return res.status(401).send('User Not Authorized!');

      case 'NoUserToken':
        return res.status(400).send('User Token Is Not Set!');

      default:
        return res.status(500).send('Server Error Occured!');
    }
  } else return res.status(500).send('Server Error Occured!');
};
