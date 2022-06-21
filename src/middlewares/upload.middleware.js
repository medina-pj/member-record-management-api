const AWS = require('aws-sdk');
const { aws_access_key, aws_secret_key, aws_bucket_name } = require('../_config');

exports.uploadFile = async (req, _, next) => {
  try {
    const file = req.file;

    if (!file) {
      req.body.file = null;
      return next();
    }

    const s3Bucket = new AWS.S3({ accessKeyId: aws_access_key, secretAccessKey: aws_secret_key });

    const file_name = Date.now() + '-' + req.file.originalname;

    const params = {
      Bucket: aws_bucket_name,
      Key: file_name,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const awsResponse = await s3Bucket.upload(params).promise();

    req.body.file_location = awsResponse.Location;

    return next();
  } catch (error) {
    return next(error);
  }
};
