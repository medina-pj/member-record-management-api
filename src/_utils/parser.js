const mongoose = require('mongoose');

//convert String input to ObjectId
exports.toObjectId = id => {
  if (mongoose.Types.ObjectId.isValid(id)) return mongoose.Types.ObjectId(id);
  else return null;
};
