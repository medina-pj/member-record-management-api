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

const Supporter = require('../controllers/supporter.controller');

//Public Routes
router.post('/', Supporter.create);

module.exports = router;
