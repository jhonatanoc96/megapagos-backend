import Router from 'express-promise-router';
import {
    crear,
    eliminar,
    actualizar,
    obtenerProyectosPorAdministrador
} from '@controllers/proyecto.controller'
import { isAuth } from '@middlewares/auth.middleware';
import { isAdmin } from '@middlewares/admin.middleware';

export const ProyectoRouter = Router()

ProyectoRouter.post('/crear', [isAuth, isAdmin], crear);
ProyectoRouter.get('/obtener-por-admin/:id', [isAuth, isAdmin], obtenerProyectosPorAdministrador);
ProyectoRouter.delete('/eliminar/:id', [isAuth, isAdmin], eliminar);
ProyectoRouter.put('/actualizar/:id', [isAuth, isAdmin], actualizar);