import express from 'express';
import {
    crearService,
    eliminarService,
    actualizarService,
    obtenerProyectosPorAdministradorService,
    obtenerTotalProyectosPorAdministradorService,
    obtenerProyectoPorIDService
} from '@services/proyecto.service';

export async function crear(req: express.Request, res: express.Response) {
    const {
        administrador_id,
        nombre,
        descripcion = ''
    } = req.body;

    if (!administrador_id) {
        return res.status(400).send({ message: 'El administrador es obligatorio' });
    }

    if (!nombre) {
        return res.status(400).send({ message: 'El nombre es obligatorio' });
    }

    try {
        const response: any = await crearService(administrador_id, nombre, descripcion);

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
        return res.status(400).send({ message: 'El ID es obligatorio' });
    }

    if (!data) {
        return res.status(400).send({ message: 'Faltan parametros' });
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

export async function obtenerProyectosPorAdministrador(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const query = req.query.query?.toString();
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    try {
        const response: any = await obtenerProyectosPorAdministradorService(id, query, page, limit);

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

export async function obtenerTotalProyectosPorAdministrador(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const query = req.query.query?.toString();

    try {
        const response: any = await obtenerTotalProyectosPorAdministradorService(id, query);

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

export async function obtenerProyectoPorID(req: express.Request, res: express.Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ message: 'El ID es obligatorio' });
    }

    try {
        const response: any = await obtenerProyectoPorIDService(id);

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