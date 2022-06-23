const express = require('express');
const router = express.Router();

const multer = require('multer')();
const { uploadFile } = require('../middlewares/upload.middleware');

//Upload Photo
router.post('/upload/photo', [multer.single('file'), uploadFile], async (req, res, next) => {
  try {
    return res.status(200).send({ location: req.body.file_location });
  } catch (error) {
    return next(error);
  }
});

const Member = require('../controllers/member.controller');

//Public Routes
router.post('/count', Member.count);

router.post('/', Member.create);

router.get('/', Member.read);

router.put('/:id', Member.update);

router.delete('/:id', Member.delete);

module.exports = router;
