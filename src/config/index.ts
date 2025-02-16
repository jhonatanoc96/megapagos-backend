import jwt from 'jsonwebtoken';
import convict from 'convict';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const env: string = process.env.NODE_ENV || '';
const envFile: string = env === 'test' ? '.env.test' : '.env';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const config = convict({
    host: {
        doc: 'Server host name / IP',
        format: '*',
        default: '0.0.0.0',
    },
    port: {
        doc: 'Server port',
        format: 'port',
        env: 'PORT',
        default: process.env.PORT,
    },
    env: {
        doc: 'Application environment',
        format: ['development', 'test', 'production'],
        env: 'NODE_ENV',
        default: 'development',
    },
    logsDir: {
        doc: 'Application logs directory',
        format: String,
        default: `${__dirname}/../../logs`,
    },
    jwtConfig: {
        secret: {
            doc: 'JWT secret',
            format: String,
            env: 'JWT_SECRET',
            default: '',
        },
        accessTokenExpiryTime: {
            doc: 'Access token expiry time (in seconds)',
            format: 'int',
            default: 28800,
        },
        refreshTokenExpiryTime: {
            doc: 'Refresh token expiry time (in seconds)',
            format: 'int',
            default: 28800,
        },
    },
    SMTP: {
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
        }
    },
});

config.validate({ allowed: 'strict' });

export const isTest: boolean = env === 'test';
export const isProduction: boolean = env === 'production';
export const db: string = process.env.POSTGRES_DATABASE || '';
export const logsDir = config.get('logsDir');
export const host = config.get('host');
export const port = config.get('port');
export const jwtConfig = config.get('jwtConfig');
export default config.getProperties();