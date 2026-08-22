const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// BACKBLAZE B2 S3 CLIENT

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
  region: "us-east-1",

  endpoint: process.env.B2_ENDPOINT,

  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },

  forcePathStyle: true,
});

// UPLOAD FILE TO B2

const uploadToR2 = async ({
  buffer,
  key,
  contentType = "application/octet-stream",
}) => {
  if (!buffer) {
    throw new Error("Upload buffer is required");
  }

  if (!key) {
    throw new Error("Storage key is required");
  }

  const command = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,

    Key: key,

    Body: buffer,

    ContentType: contentType,
  });

  await s3Client.send(command);

  return {
    bucket: process.env.B2_BUCKET_NAME,
    key,
  };
};

// GENERATE TEMPORARY SIGNED URL

const getSignedRecordingUrl = async (key, expiresIn = 3600) => {
  if (!key) {
    throw new Error("Storage key is required");
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

module.exports = {
  uploadToR2,
  getSignedRecordingUrl,
};
