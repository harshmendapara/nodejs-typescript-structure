import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  // eslint-disable-next-line comma-dangle
  port: process.env.PORT,
  // databaseURI: `mongodb+srv://${process.env.MONGOOSE_URI_USERNAME}:${process.env.MONGOOSE_URI_PASSWORD}@${process.env.MONGO_URI}/${process.env.MONGOOSE_URI_DB}?retryWrites=true`,
  databaseURI: `mongodb://localhost:27017/nodejs-typescript-structure`,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  logs: {
    level: process.env.LOG_LEVEL || 'silly'
  },
  api: {
    prefix: '/api'
  }
};
