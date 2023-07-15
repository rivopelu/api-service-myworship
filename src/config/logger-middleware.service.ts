import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as chalk from 'chalk';
import { DateHelper } from '../helper/date-helper';
import * as dateFns from 'date-fns';

const filePath = 'logs/application-%DATE%.log';

const logger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      filename: filePath,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, headers } = req;
    const platform = headers['user-agent'];
    const os = headers['user-agent'];

    const timestamp = dateFns.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const message = `[App] - ${timestamp} - ${req.method.toUpperCase()} ${
      req.originalUrl
    } - ${res.statusCode}`;

    console.info(chalk.blue.bold(message));

    logger.info(`${timestamp}`, {
      method: req.method.toUpperCase(),
      url: req.originalUrl,
      os,
      ip,
      res: res.statusCode,
      platform,
    });

    next();
  }
}
