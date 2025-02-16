import express from 'express';
import jwt from 'jsonwebtoken';

export function isUser(req: express.Request | any, res: express.Response, next: express.NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Token no proporcionado' });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const decoded: any = jwt.verify(token, secret);
        const usuario = decoded.usuario;

        if (usuario.rol !== 'usuario') {
            return res.status(401).send({ message: 'Solo un usuario normal puede realizar esta acción.' });
        }

        next();
    } catch (error) {
        return res.status(401).send({ message: 'Solo un usuario normal puede realizar esta acción.' });
    }
}