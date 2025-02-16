import Router from 'express-promise-router';
import express from 'express';
import {
    autenticar,
    registrar,
    eliminar,
    actualizar,
    obtenerUsuariosPorAdministrador
} from '@controllers/usuario.controller'
import { isAuth } from '@middlewares/auth.middleware';

export const UsuarioRouter = Router()

UsuarioRouter.post('/autenticar', autenticar);
UsuarioRouter.post('/registrar', registrar);
UsuarioRouter.get('/obtener', isAuth, obtenerUsuariosPorAdministrador);
UsuarioRouter.delete('/eliminar/:correo', isAuth, eliminar);
UsuarioRouter.put('/actualizar/:correo', isAuth, actualizar);