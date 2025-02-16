import Router from 'express-promise-router';
import {
    crear,
    eliminar,
    obtenerProyectosPorUsuariosAsociados
} from '@controllers/usuario-proyecto.controller'
import { isAuth } from '@middlewares/auth.middleware';
import { isUser } from '@middlewares/user.middleware';
import { isAdmin } from '../middlewares/admin.middleware';

export const UsuarioProyectoRouter = Router()

UsuarioProyectoRouter.post('/crear', [isAuth, isAdmin], crear);
UsuarioProyectoRouter.get('/obtener-por-usuario/:id', [isAuth, isUser], obtenerProyectosPorUsuariosAsociados);
UsuarioProyectoRouter.delete('/eliminar/:id', [isAuth, isAdmin], eliminar);