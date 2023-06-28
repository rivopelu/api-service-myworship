import 'dotenv/config';

export const ENV = {
  PORT: parseInt(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET_KEY,
  GOOGLE_API: process.env.GOOGLE_API,
  CLIENT_URL: process.env.CLIENT_URL,
  DB: {
    NAME: process.env.DB_NAME,
    USER: process.env.DB_USER,
    PW: process.env.DB_PW,
    HOST: process.env.DB_HOST,
    PORT: parseInt(process.env.DB_PORT),
  },
  AWS: {
    REGION: process.env.AWS_S3_REGION,
    BUCKET: process.env.AWS_S3_BUCKET,
    ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    SECRET_KEY: process.env.AWS_SECRET_KEY,
    FOLDER_S3: process.env.AWS_S3_FOLDER,
  },
  EMAIL: {
    USER: process.env.EMAIL_USER,
    PASSWORD: process.env.EMAIL_PW,
  },
};
