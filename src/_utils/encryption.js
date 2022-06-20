const bcrypt = require('bcrypt');

exports.encrypt = async (data, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(data, salt);
    return hashed;
  } catch (error) {
    return next(error);
  }
};

exports.compare = async (data, encryptedData, next) => {
  try {
    const result = await bcrypt.compare(data, encryptedData);
    return result;
  } catch (error) {
    return next(error);
  }
};
