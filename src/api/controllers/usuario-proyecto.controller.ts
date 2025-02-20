import express from 'express';
import {
    crearService,
    eliminarService,
    obtenerProyectosPorUsuariosAsociadosService
} from '@services/usuario-proyecto.service';

export async function crear(req: express.Request, res: express.Response) {
    const {
        usuario_id,
        proyecto_id
    } = req.body;

    if (!usuario_id || !proyecto_id) {
        return res.status(400).send({ message: 'Faltan parámetros' });
    }

    try {
        const response: any = await crearService(usuario_id, proyecto_id);

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
    const {
        usuario_id,
        proyecto_id
    } = req.body;

    if (!usuario_id || !proyecto_id) {
        return res.status(400).send({ message: 'Faltan parámetros' });
    }

    try {
        const response: any = await eliminarService(usuario_id, proyecto_id);

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

export async function obtenerProyectosPorUsuariosAsociados(req: express.Request, res: express.Response) {
    const { id } = req.params;

    try {
        const response: any = await obtenerProyectosPorUsuariosAsociadosService(id);

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