const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

/*
BACKBLAZE B2 S3 CLIENT
*/

const requiredEnv = [
  "B2_APPLICATION_KEY_ID",
  "B2_APPLICATION_KEY",
  "B2_BUCKET_NAME",
  "B2_ENDPOINT",
];

for (const variable of requiredEnv) {
  if (!process.env[variable]) {
    console.warn(`⚠️ Missing environment variable: ${variable}`);
  }
}

const s3Client = new S3Client({
  /*
  Backblaze B2 provides an S3-compatible API.

  We use the B2 endpoint from Render environment
  variables.
  */

  region: "us-east-1",

  endpoint: process.env.B2_ENDPOINT,

  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },

  /*
  Required for B2 S3-compatible storage.
  */

  forcePathStyle: true,
});

/*
UPLOAD FILE TO BACKBLAZE B2
*/

const uploadToB2 = async ({
  buffer,
  stream,
  key,
  contentType = "application/octet-stream",
  contentLength,
}) => {
  if (!buffer && !stream) {
    throw new Error("Upload buffer or stream is required");
  }

  if (!key) {
    throw new Error("Storage key is required");
  }

  if (!process.env.B2_BUCKET_NAME) {
    throw new Error("B2_BUCKET_NAME is not configured");
  }

  const commandParams = {
    Bucket: process.env.B2_BUCKET_NAME,

    Key: key,

    Body: buffer || stream,

    ContentType: contentType,
  };

  /*
  ContentLength is useful when uploading a stream.
  */

  if (contentLength) {
    commandParams.ContentLength = Number(contentLength);
  }

  const command = new PutObjectCommand(commandParams);

  await s3Client.send(command);

  console.log("=================================");
  console.log("✅ FILE UPLOADED TO BACKBLAZE B2");
  console.log("=================================");
  console.log("📦 Bucket:", process.env.B2_BUCKET_NAME);
  console.log("📦 Key:", key);

  return {
    bucket: process.env.B2_BUCKET_NAME,
    key,
  };
};

/*
GENERATE TEMPORARY SIGNED URL

The bucket remains PRIVATE.

The frontend receives a temporary URL that
expires after the specified number of seconds.
*/

const getSignedB2RecordingUrl = async (key, expiresIn = 3600) => {
  if (!key) {
    throw new Error("Storage key is required");
  }

  if (!process.env.B2_BUCKET_NAME) {
    throw new Error("B2_BUCKET_NAME is not configured");
  }

  const command = new GetObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,

    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn,
  });

  return signedUrl;
};

/*
EXPORTS
*/

module.exports = {
  uploadToB2,
  getSignedB2RecordingUrl,
};
