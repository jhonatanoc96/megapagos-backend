import Router from 'express';
import morgan from 'morgan';
import { logger } from '@config/logger';
import NotFound from 'http-errors';
import { UsuarioRouter } from '@routes/usuario.routes';
import { ProyectoRouter } from './routes/proyecto.routes';

export const router = Router();

/**
 * Router configuration    
 */
router.use(
    morgan(':status - [:method :url - :remote-addr] :response-time ms', {
        stream: {
            write: message => logger.info(message),
        },
        skip: (req, res) => res.statusCode >= 400,
    })
);

/**
 * API routes
 */
router.get('/', (req, res) => res.sendStatus(200));
router.use('/usuarios', UsuarioRouter);
router.use('/proyectos', ProyectoRouter);

/**
 * 404 error handling
 */
router.use((req, res, next) => {
    const { baseUrl, url, method } = req;

    next(new (NotFound as any)(`The route '${method} ${baseUrl}${url}' doesn't exist`));
});

export default router;