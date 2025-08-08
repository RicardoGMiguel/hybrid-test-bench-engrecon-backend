import { sub } from 'date-fns';
import winston, { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(
  ({ level, message, timestamp }) => `${sub(new Date(timestamp), { hours: 3 }).toISOString()} ${level}: ${message}`,
);

// Hide request logging from console, but record it on log files
const consoleRequestFilter = winston.format((info, _) => {
  if (info.meta && info.meta.req) {
    return false;
  }
  return info;
});

const fileRotateTransport = new DailyRotateFile({
  filename: 'logs/logs-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '5d',
  maxSize: '5m',
});

const logger = createLogger({
  format: combine(timestamp(), customFormat),
  transports: [
    fileRotateTransport,
    new transports.Console({ format: combine(timestamp(), consoleRequestFilter(), colorize(), customFormat) }),
    new winston.transports.File({ filename: 'logs/errors.log', level: 'error', maxsize: 5000000, maxFiles: 3 }),
    new winston.transports.File({ filename: 'logs/warnings.log', level: 'warn', maxsize: 5000000, maxFiles: 3 }),
  ],
});

export default logger;
