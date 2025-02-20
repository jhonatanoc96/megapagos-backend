import express from 'express';
import {
    autenticarService,
    eliminarService,
    registrarService,
    actualizarService,
    obtenerUsuariosPorAdministradorService,
    obtenerTotalUsuariosPorAdministradorService,
    obtenerUsuarioPorIDService
} from '@services/usuario.service';
import { stat } from 'fs';

export async function autenticar(req: express.Request, res: express.Response) {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).send({ message: 'El correo es obligatorio' });
    }

    if (!password) {
        return res.status(400).send({ message: 'La contraseña es obligatoria' });
    }

    try {
        const response: any = await autenticarService(email, password);

        if (!response || response?.status != 200 || !response?.usuario || !response?.message) {
            return res.status(500).send({
                status: 500,
                message: 'Error',
            });
        }

        return res.status(200).send({
            status: 200,
            message: response?.message,
            user: response?.usuario,
            token: response?.token
        });

    } catch (error: any) {
        return res.status(error?.status || 500).send({
            status: error?.status || 500,
            message: error?.message || 'Error',
        });

    }
}

export async function registrar(req: express.Request, res: express.Response) {
    const {
        nombre,
        email,
        password,
        rol,
        administrador_id
    } = req.body;

    if (!nombre) {
        return res.status(400).send({ message: 'El nombre es obligatorio' });
    }

    if (!email) {
        return res.status(400).send({ message: 'El correo es obligatorio' });
    }

    if (!password) {
        return res.status(400).send({ message: 'La contraseña es obligatoria' });
    }

    if (!rol) {
        return res.status(400).send({ message: 'El rol es obligatorio' });
    }

    try {
        const response: any = await registrarService(nombre, email, password, rol, administrador_id);

        if (!response || response?.status != 200 || !response?.message) {
            return res.status(500).send({
                status: 500,
                message: 'Error',
            });
        }

        return res.status(200).send({
            status: 200,
            message: response?.message
        });
    } catch (error: any) {
        return res.status(error?.status || 500).send({
            status: error?.status || 500,
            message: error?.message || 'Error',
        });
    }
}

export async function eliminar(req: express.Request, res: express.Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ message: 'El ID es obligatorio' });
    }

    try {
        const response: any = await eliminarService(id);

        if (!response || response?.status != 200 || !response?.message) {
            return res.status(500).send({
                status: 500,
                message: 'Error'
            });
        }

        return res.status(200).send({
            status: 200,
            message: response?.message,
            response: response?.response
        });
    } catch (error: any) {
        return res.status(error?.status || 500).send({
            status: error?.status || 500,
            message: error?.message || 'Error',
        });
    }

}

export async function actualizar(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const { data } = req.body;

    if (!id) {
        return res.status(400).send({ message: 'El ID es obligatorio', status: 400 });
    }

    if (!data) {
        return res.status(400).send({ message: 'Faltan parámetros', status: 400 });
    }

    try {
        await actualizarService(id, data);

        return res.status(200).send({
            status: 200,
            message: 'Usuario actualizado correctamente'
        });

    } catch (error: any) {
        return res.status(error?.status || 500).send({
            status: error?.status || 500,
            message: error?.message || 'Error',
        });
    }
}

export async function obtenerUsuariosPorAdministrador(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const query = req.query.query?.toString();
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    try {
        const response: any = await obtenerUsuariosPorAdministradorService(id, query, page, limit);

        if (!response || response?.status != 200 || !response?.message) {
            return res.status(500).send({
                status: 500,
                message: 'Error'
            });
        }

        return res.status(200).send({
            status: 200,
            message: response?.message,
            response: response?.response
        });
    } catch (error: any) {
        return res.status(error?.status || 500).send({
            status: error?.status || 500,
            message: error?.message || 'Error',
        });
    }
}

export async function obtenerTotalUsuariosPorAdministrador(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const query = req.query.query?.toString();

    try {
        const response: any = await obtenerTotalUsuariosPorAdministradorService(id, query);

        if (!response || response?.status != 200 || !response?.message) {
            return res.status(500).send({
                status: 500,
                message: 'Error'
            });
        }

        return res.status(200).send({
            status: 200,
            message: response?.message,
            response: response?.response
        });
    } catch (error: any) {
        return res.status(error?.status || 500).send({
            status: error?.status || 500,
            message: error?.message || 'Error',
        });
    }
}

export async function obtenerUsuarioPorID(req: express.Request, res: express.Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ message: 'El ID es obligatorio', status: 400 });
    }
    
    try {
        const response: any = await obtenerUsuarioPorIDService(id);

        if (!response || response?.status != 200 || !response?.message) {
            return res.status(500).send({
                status: 500,
                message: 'Error'
            });
        }

        return res.status(200).send({
            status: 200,
            message: response?.message,
            response: response?.response
        });
    } catch (error: any) {
        return res.status(error?.status || 500).send({
            status: error?.status || 500,
            message: error?.message || 'Error',
        });
    }
}