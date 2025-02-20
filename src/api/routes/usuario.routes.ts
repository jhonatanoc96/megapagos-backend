import Router from 'express-promise-router';
import {
    autenticar,
    registrar,
    eliminar,
    actualizar,
    obtenerUsuariosPorAdministrador,
    obtenerTotalUsuariosPorAdministrador,
    obtenerUsuarioPorID,
    obtenerUsuariosPorAdministradorConProyectoPorID
} from '@controllers/usuario.controller'
import { isAuth } from '@middlewares/auth.middleware';
import { isAdmin } from '@middlewares/admin.middleware';

export const UsuarioRouter = Router()

UsuarioRouter.post('/autenticar', autenticar);
UsuarioRouter.post('/registrar', registrar);
UsuarioRouter.get('/obtener-por-id/:id', [isAuth, isAdmin], obtenerUsuarioPorID);
UsuarioRouter.get('/obtener-por-admin/:id', [isAuth, isAdmin], obtenerUsuariosPorAdministrador);
UsuarioRouter.get('/obtener-por-admin-con-proyecto/:id/:project_id', [isAuth, isAdmin], obtenerUsuariosPorAdministradorConProyectoPorID);
UsuarioRouter.get('/obtener-total-por-admin/:id', [isAuth, isAdmin], obtenerTotalUsuariosPorAdministrador);
UsuarioRouter.delete('/eliminar/:id', [isAuth, isAdmin], eliminar);
UsuarioRouter.put('/actualizar/:id', [isAuth, isAdmin], actualizar);