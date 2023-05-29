export const configs = {
  PORT: process.env.PORT || 5001,
  DB_URL: process.env.DB_URL || "ілтіоаотала",

  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "aaa",
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "bbb",

  CHANGE_TYPE_ACCOUNT_SECRET: process.env.CHANGE_TYPE_ACCOUNT_SECRET,

  ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME || "20m",
  REFRESH_TOKEN_TIME: process.env.REFRESH_TOKEN_TIME || "10d",

  CHANGE_TYPE_ACCOUNT_TIME: process.env.CHANGE_TYPE_ACCOUNT_TIME || "10d",

  NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL,
  NO_REPLY_EMAIL_PASSWORD: process.env.NO_REPLY_EMAIL_PASSWORD,

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_SERVICE_SID: process.env.TWILIO_SERVICE_SID,

  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,

  AWS_S3_NAME: process.env.AWS_S3_NAME,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_URL: process.env.AWS_S3_URL,
  AWS_S3_ACL: process.env.AWS_S3_ACL,

  FRONT_URL: process.env.FRONT_URL,
};
