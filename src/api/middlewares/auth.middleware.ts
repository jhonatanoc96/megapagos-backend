import config from '@config/index';
import express from 'express';
import {
    decodeToken
} from '@src/api/services/usuario.service';
const { jwtConfig } = config;

export function isAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'No tienes autorización' });
    }

    const token = req.headers.authorization.split(' ')[1];

    decodeToken(token)
        .then(response => {
            next();
        })
        .catch(response => {
            res.status(response.status).send({ message: response.message });
        });

}