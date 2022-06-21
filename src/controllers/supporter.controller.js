const Supporter = require('../models/supporter.model');
const Encryption = require('../_utils/encryption');
const { idSecretKey } = require('../_config');

//Public Routes
exports.create = async (req, res, next) => {
  try {
    const io = req.app.get('socketio');
    const payload = req.body.payload;

    if (payload.is_coordinator) {
      //check username and password length
      if (payload.account_info.username.length < 6 || payload.account_info.password.length < 6)
        return next({ codeName: 'InvalidAccount' });

      //Check username for duplication
      const usernameExist = await Supporter.findOne({
        'account_info.username': payload.account_info.username,
      });

      if (usernameExist) return next({ codeName: 'DuplicateKey' });

      //Encrypt Password
      payload.account_info.password = await Encryption.encrypt(payload.account_info.password, next);
    }

    let doc = new Supporter(payload);

    await doc.save();

    io.emit('readSupportersCount');

    return res.status(200).send(doc);
  } catch (error) {
    return next(error);
  }
};

exports.count = async (_, res, next) => {
  try {
    const count = await Supporter.countDocuments({ isDeleted: false });
    return res.status(200).send({ count });
  } catch (error) {
    return next(error);
  }
};
