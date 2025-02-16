import { existsSync, mkdirSync } from 'fs';
import moment from 'moment';
import { createLogger, format, transports } from 'winston';
import { isProduction, logsDir } from './index';

// Check if logs folder exists
if (!existsSync(logsDir)) {
    mkdirSync(logsDir);
}

const customFormat = format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);

// Configure file logs
export const logger = createLogger({
    level: isProduction ? 'info' : 'debug',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        customFormat
    ),
    transports: [
        new transports.File({
            dirname: logsDir,
            filename: `${moment().format('YYYY-MM-DD')}-combined.log`,
        }),
        new transports.File({
            level: 'error',
            dirname: logsDir,
            filename: `${moment().format('YYYY-MM-DD')}-errors.log`,
        }),
    ],
    exitOnError: false,
});

// If app is in not in production mode, log output to console
if (!isProduction) {
    logger.add(
        new transports.Console({
            format: format.combine(format.colorize(), customFormat),
        })
    );
}