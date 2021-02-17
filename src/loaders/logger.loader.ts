import winston from 'winston';
import config from '../config/config';
import {LOGGER_LEVELS} from '../utils/app.constants';
const {combine, timestamp, label, printf, errors, metadata} = winston.format;

const myFormat = printf(({level, message, label, timestamp}) => {
  return `[${level}] ${label} ${timestamp} ${message}`;
});

const transports: any = [];
if (process.env.NODE_ENV !== 'development') {
  transports.push(
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'assets/logs/combined.log',
      level: LOGGER_LEVELS.INFO
    }),
    new winston.transports.File({
      filename: 'assets/logs/error.log',
      level: LOGGER_LEVELS.ERROR
    })
  );
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.cli(), winston.format.splat())
    })
  );
}

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: combine(
    label({label: 'date:'}),
    timestamp({
      format: 'MM-DD-YYYY HH:mm:ss'
    }),
    errors({stack: true}),
    myFormat
  ),
  transports
});

export default LoggerInstance;
