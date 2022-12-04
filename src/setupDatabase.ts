import mongoose from 'mongoose';
import { config } from './config';
import Logger from 'bunyan';

//
const log: Logger = config.createLogger('database');

export default () => {
  const connect = () => {
    // TODO: This is a local database, change before production
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info('Successfully Connected to database');
      })
      .catch((err) => {
        log.error('Error Connecting to the Database', err);
        return process.exit(1);
      });
  };

  connect();

  mongoose.connection.on('disconnected', connect); // if the server is disconnect it's try to connect again
};
