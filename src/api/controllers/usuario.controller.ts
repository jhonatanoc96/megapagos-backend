import express from 'express';
import path from 'path';
import {
    autenticarService,
    eliminarService,
    registrarService,
    actualizarService,
    obtenerUsuariosPorAdministradorService
} from '@src/api/services/usuario.service';

export async function autenticar(req: express.Request, res: express.Response) {
    const { correo, contrasena } = req.body;

    if (!correo) {
        return res.status(400).send({ message: 'El correo es obligatorio' });
    }

    if (!contrasena) {
        return res.status(400).send({ message: 'La contraseña es obligatoria' });
    }

    try {
        const response: any = await autenticarService(correo, contrasena);

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
            primerLogin: response?.primerLogin,
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
        correo,
        contrasena,
        nombre,
        apellido,
        cel,
        utc,
        pais,
        cedula
    } = req.body;

    if (!correo) {
        return res.status(400).send({ message: 'El correo es obligatorio' });
    }

    if (!contrasena) {
        return res.status(400).send({ message: 'La contraseña es obligatoria' });
    }

    if (!nombre) {
        return res.status(400).send({ message: 'El nombre es obligatorio' });
    }

    if (!apellido) {
        return res.status(400).send({ message: 'El apellido es obligatorio' });
    }

    try {
        const response: any = await registrarService(correo, contrasena, nombre, apellido, cel, utc, pais, cedula);

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
    const { correo } = req.params;
    const { preview } = req.query;

    if (!correo) {
        return res.status(400).send({ message: 'El correo es obligatorio' });
    }

    try {
        const response: any = await eliminarService(correo, preview?.toString());

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
    const { correo } = req.query;

    if (!correo) {
        return res.status(400).send({ message: 'El correo es obligatorio' });
    }

    try {
        const response: any = await actualizarService(correo.toString());

        if (response?.status == 200) {
            return res.status(200).sendFile(path.join(__dirname + '/pages/account_activated.html'));

        } else {
            return res.status(500).sendFile(path.join(__dirname + '/pages/error.html'));
        }

    } catch (error: any) {
        if (error?.status == 404) {
            return res.status(404).sendFile(path.join(__dirname + '/pages/account_not_found.html'));

        } else if (error?.status == 403) {
            return res.status(403).sendFile(path.join(__dirname + '/pages/account_already_activated.html'));

        } else {
            return res.status(500).sendFile(path.join(__dirname + '/pages/error.html'));
        }
    }
}


export async function obtenerUsuariosPorAdministrador(req: express.Request, res: express.Response) {
    const { correo } = req.body;

    if (!correo) {
        return res.status(400).send({ message: 'El correo es obligatorio' });
    }

    try {
        const response: any = await obtenerUsuariosPorAdministradorService(correo);

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