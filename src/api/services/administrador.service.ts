import moment from 'moment';
import {
    generateToken,
    getDecodedToken
} from '@services/utils.service'
// import { Usuario } from '@models/usuario.model';

const Usuario: any = {};

export async function createToken(usuario: any) {
    const payload = {
        sub: usuario._id,
        iat: moment().unix()
    };

    return await generateToken(payload, payload);
}

export async function decodeToken(token: any) {
    const decoded = new Promise((resolve, reject) => {
        try {
            const payload: any = getDecodedToken(token);

            if (payload.exp <= moment().unix()) {
                reject({
                    status: 401,
                    message: 'El token ha expirado'
                });
            }
            resolve(payload.sub);

        } catch (error) {
            reject({
                status: 403,
                message: 'Token inválido'
            });
        }
    });

    return decoded;
}

export function autenticarService(correo: string, contrasena: string) {
    return new Promise(async (resolve, reject) => {
        try {
            let usuario = {};

            // Validar si existe
            if (!usuario) {
                reject({
                    status: 404,
                    message: 'Usuario no encontrado'
                });
            }

            // Generar token
            const token = await createToken(usuario);

            resolve({
                status: 200,
                usuario,
                token,
                message: 'Ha iniciado sesión correctamente',
            });

        } catch (error) {
            reject({
                status: 500,
                message: 'Error al autenticar'
            });
        }
    });
}

export async function registrarService(
    correo: string,
    contrasena: string,
    nombre: string,
    apellido: string,
    cel: string,
    utc: string,
    pais: string,
    cedula: string
) {

    // const usuario = new Usuario({
    //     correo,
    //     contrasena,
    //     nombre,
    //     apellido,
    //     cel,
    //     utc,
    //     pais,
    //     cedula,
    //     dias_licencia: 7,
    // });

    // return new Promise(async (resolve, reject) => {
    //     try {
    //         await usuario.save();

    //         resolve({
    //             status: 200,
    //             message: 'Gracias por registrarte'
    //         });

    //     } catch (error: any) {
    //         if (error) {
    //             reject({
    //                 status: 500,
    //                 message: `Error al registrar: ${error}`,
    //             });
    //         }

    //         reject({
    //             status: 500,
    //             message: 'Error al registrar'
    //         });
    //     }
    // });
}

export async function eliminarService(
    correo: string,
    preview: string = 'false'
) {

    return new Promise(async (resolve, reject) => {
        try {
            // Obtener usuario
            const usuario = {};

            if (!usuario) {
                reject({
                    status: 404,
                    message: 'Usuario no encontrado'
                });
            }

            resolve({
                status: 200,
                message: 'Usuario eliminado correctamente',
                response: {
                    usuario
                }
            });

        } catch (error: any) {
            if (error) {
                reject({
                    status: 500,
                    message: `Error al eliminar el usuario: ${error}`,
                });
            }

            reject({
                status: 500,
                message: 'Error al eliminar'
            });
        }
    });
}


export function actualizarService(correo: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const usuario = {};

            // Validar si existe
            if (!usuario || usuario == null) {
                reject({
                    status: 404,
                    message: 'Usuario no encontrado'
                });
            }

            resolve({
                status: 200,
                message: 'Cuenta activada correctamente',
            });

        } catch (error) {
            reject({
                status: 500,
                message: 'Error al activar cuenta'
            });
        }
    });
}

export function obtenerUsuariosPorAdministradorService(correo: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const usuario: any = {};

            // Validar si existe
            if (!usuario || usuario == null) {
                reject({
                    status: 404,
                    message: `El usuario con correo ${correo} no existe`
                });
            }

            // Validar contraseña 
            const promise = await new Promise((resolve, reject) => {
                const response = usuario.generatePasswordReset();
                if (response) {
                    resolve(response);
                } else {
                    reject(null);
                }
            });

            if (!promise || promise == null) {
                reject({
                    status: 500,
                    message: 'Error al generar token'
                });
            }

            await usuario.save();

            resolve({
                status: 200,
                message: `Se ha enviado un correo para restablecer la contraseña a ${usuario.correo}`
            });

        } catch (error) {
            reject({
                status: 500,
                message: 'Error al activar cuenta'
            });
        }
    });
}