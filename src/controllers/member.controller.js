const Member = require('../models/member.model');
const Encryption = require('../_utils/encryption');
const { toObjectId } = require('../_utils/parser');

//Public Routes

//Create New Member
exports.create = async (req, res, next) => {
  try {
    const io = req.app.get('socketio');
    const payload = req.body.payload;

    if (payload.is_coordinator) {
      //Check Username and Password Length
      if (payload.account_info.username.length < 6 || payload.account_info.password.length < 6)
        return next({ codeName: 'InvalidAccount' });

      //Check Username for Duplication
      const usernameExist = await Member.findOne({
        'account_info.username': payload.account_info.username,
      });

      if (usernameExist) return next({ codeName: 'DuplicateKey' });

      //Encrypt Password
      payload.account_info.password = await Encryption.encrypt(payload.account_info.password, next);
    }

    let doc = new Member(payload);

    await doc.save();

    io.emit('readMembersCount');

    return res.status(200).send(doc);
  } catch (error) {
    return next(error);
  }
};

//Read Members
exports.read = async (req, res, next) => {
  try {
    const query = req.query;

    //Pagination Options
    const reqSkip = query.skip;
    const reqLimit = query.limit;
    const skip = reqSkip ? Number(reqSkip) * Number(reqLimit) : 0;
    const limit = reqSkip && reqLimit && Number(reqLimit) <= 50 ? Number(reqLimit) : 50;

    //Filter Pipeline
    const last_name = query.last_name ? { $text: { $search: query.last_name } } : null;
    const level = query.level || null;
    const region = query.region || null;
    const province = query.province || null;
    const city = query.city || null;
    const barangay = query.barangay || null;

    const pipelineQuery = {
      isDeleted: false,
      ...last_name,
      [level && 'coordinator_level']: level && Number(level),
      [region && 'address.region']: region,
      [province && 'address.province']: province,
      [city && 'address.city']: city,
      [barangay && 'address._id']: toObjectId(barangay),
    };

    const totalDocs = await Member.countDocuments(pipelineQuery);

    const docs = await Member.find(pipelineQuery)
      .populate({
        path: 'added_by',
        select:
          'first_name last_name middle_name suffix contact_number email_address address coordinator_level',
      })
      .select('-isDeleted -__v -account_info.password')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).send({ totalDocs, docs });
  } catch (error) {
    return next(error);
  }
};

//Update Members
exports.update = async (req, res, next) => {
  try {
    const payload = req.body.payload;
    const id = req.params.id;

    let password = payload?.account_info?.password || null;

    console.log(password);

    if (password) {
      //Check Password Length
      if (password.length < 6) return next({ codeName: 'InvalidAccount' });

      //Encrypt Password
      password = await Encryption.encrypt(password, next);
    }

    const doc = await Member.findByIdAndUpdate(
      id,
      {
        ...payload,
        [password && 'account_info.password']: password,
      },
      {
        runValidators: true,
        omitUndefined: true,
        new: true,
        select: '-isDeleted -__v -account_info.password',
      }
    ).populate({
      path: 'added_by',
      select:
        'first_name last_name middle_name suffix contact_number email_address address coordinator_level',
    });

    if (!doc) return next({ codeName: 'NotFound' });

    return res.status(200).send(doc);
  } catch (error) {
    return next(error);
  }
};

//Delete Members
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;

    const doc = await Member.findByIdAndUpdate(id, {
      isDeleted: true,
      // deleted_by: req.user._id,
    });
    if (!doc) return next({ codeName: 'NotFound' });

    return res.status(200).send('Successfully deleted.');
  } catch (error) {
    return next(error);
  }
};

//Count Members
exports.count = async (_, res, next) => {
  try {
    const count = await Member.countDocuments({ isDeleted: false });
    return res.status(200).send({ count });
  } catch (error) {
    return next(error);
  }
};
