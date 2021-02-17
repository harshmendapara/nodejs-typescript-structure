import mongoose from 'mongoose';
import {Db} from 'mongodb';
import config from '../config/config';

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.databaseURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  return connection.connection.db;
};
