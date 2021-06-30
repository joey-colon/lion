import winston from 'winston';
import { Mode } from '../common/types';

const Papertrail = require('winston-papertrail').Papertrail;

export const LogManager = {
  initLogger() {
    winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      defaultMeta: {},
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
      exceptionHandlers: [new winston.transports.File({ filename: 'exceptions.log' })],
    });
            
    if (process.env.NODE_ENV !== Mode.Production || !process.env.PAPERTRAIL_HOST) {
      winston.add(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
        })
      );
    } else {
      const papertrailTransport = new Papertrail({
        host: process.env.PAPERTRAIL_HOST,
        port: +(process.env.PAPERTRAIL_PORT ?? 0),
      });
      papertrailTransport.on('error', console.error);
      winston.add(papertrailTransport);
    }
  }
};


