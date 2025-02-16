import jwt from 'jsonwebtoken';
import config from '@config/index';

const { jwtConfig } = config;
const { secret, accessTokenExpiryTime, refreshTokenExpiryTime } = jwtConfig;

const getOptions = (expiresIn: number): jwt.SignOptions => {
    return {
        algorithm: 'HS256',
        expiresIn,
    };
}

export function signPayload(payload: string | Buffer | object, secretOrPrivateKey: string | Buffer, options?: jwt.SignOptions): string {
    return jwt.sign(payload, secretOrPrivateKey, options);
}

// Generate tokens
export function generateToken(accessTokenPayload: any, refreshTokenPayload: any) {
    // Generate access token
    const accessTokenOptions: jwt.SignOptions = getOptions(accessTokenExpiryTime);
    const accessToken = signPayload(accessTokenPayload, secret, accessTokenOptions);

    // Generate refresh token
    const refreshTokenOptions: jwt.SignOptions = getOptions(refreshTokenExpiryTime);
    const refreshToken = signPayload(refreshTokenPayload, secret, refreshTokenOptions);

    return { accessToken, refreshToken };
}

// Returns the decoded payload of a token
export function getDecodedToken(token: string) {
    // return jwt.decode(token);
    return jwt.verify(token, secret);
}

export function limitDecimalPlaces(value: number, decimalPlaces = 1) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
}
