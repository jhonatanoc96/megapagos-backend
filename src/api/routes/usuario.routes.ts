import Router from 'express-promise-router';
import {
    autenticar,
    registrar,
    eliminar,
    actualizar,
    obtenerUsuariosPorAdministrador
} from '@controllers/usuario.controller'
import { isAuth } from '@middlewares/auth.middleware';
import { isAdmin } from '@middlewares/admin.middleware';

export const UsuarioRouter = Router()

UsuarioRouter.post('/autenticar', autenticar);
UsuarioRouter.post('/registrar', registrar);
UsuarioRouter.get('/obtener-por-admin/:id', [isAuth, isAdmin], obtenerUsuariosPorAdministrador);
UsuarioRouter.delete('/eliminar/:id', [isAuth, isAdmin], eliminar);
UsuarioRouter.put('/actualizar/:id', [isAuth, isAdmin], actualizar);