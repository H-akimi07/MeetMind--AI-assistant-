const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const b2 = new S3Client({
  region: "us-east-1",

  endpoint: process.env.B2_ENDPOINT,

  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },

  forcePathStyle: true,
});

const bucketName = process.env.B2_BUCKET_NAME;

/**
 * Upload a file/stream to Backblaze B2
 */
async function uploadToB2({
  key,
  body,
  contentType = "application/octet-stream",
  contentLength,
}) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,

    ...(contentLength
      ? {
          ContentLength: contentLength,
        }
      : {}),
  });

  return b2.send(command);
}

/**
 * Get an object from B2
 */
async function getFromB2(key) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return b2.send(command);
}

/**
 * Delete an object from B2
 */
async function deleteFromB2(key) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return b2.send(command);
}

module.exports = {
  b2,
  bucketName,
  uploadToB2,
  getFromB2,
  deleteFromB2,
};
