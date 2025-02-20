import moment from 'moment';
import {
    generateToken,
    getDecodedToken,
} from '@services/utils.service'
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import { UsuarioInterface } from '../interfaces/usuario.interface';
import { Op } from 'sequelize';
import { UsuarioProyectos } from '../models/usuario-proyecto.model';

export async function createToken(usuario: any) {
    const payload = {
        sub: usuario._id,
        iat: moment().unix(),
        usuario
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

export function autenticarService(email: string, password: string) {
    return new Promise(async (resolve, reject) => {
        try {
            // Obtener usuario
            const usuario = await Usuario.findOne({
                where: {
                    email
                }
            }) as UsuarioInterface | null;

            // Validar si existe
            if (!usuario) {
                reject({
                    status: 404,
                    message: 'Usuario no encontrado'
                });
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, usuario.password);

            if (!isPasswordValid) {
                reject({
                    status: 401,
                    message: 'Contraseña incorrecta'
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
    nombre: string,
    email: string,
    password: string,
    rol: string,
    administrador_id: string | null = null
) {

    return new Promise(async (resolve, reject) => {
        try {

            const usuario = new Usuario();

            usuario.nombre = nombre;
            usuario.email = email;
            usuario.password = password;
            usuario.rol = rol;
            usuario.administrador_id = administrador_id ? parseInt(administrador_id) : null;

            await usuario.save();

            resolve({
                status: 200,
                message: `El usuario ${nombre} ha sido registrado correctamente`,
            });

        } catch (error: any) {
            if (error) {
                if (error.toString().includes('SequelizeUniqueConstraintError')) {
                    reject({
                        status: 400,
                        message: `El correo ${email} ya está en uso`,
                    });
                }

                reject({
                    status: 500,
                    message: `Error al registrar: ${error}`,
                });
            }

            reject({
                status: 500,
                message: 'Error al registrar'
            });
        }
    });
}

export async function eliminarService(
    id: string,
) {

    return new Promise(async (resolve, reject) => {
        try {
            const usuario = await Usuario.findByPk(id) as Usuario;

            // Validar si existe
            if (!usuario) {
                reject({
                    status: 404,
                    message: 'Usuario no encontrado'
                });
                return;
            }

            await usuario.destroy();

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


export function actualizarService(
    id: string,
    data: any
) {
    return new Promise(async (resolve, reject) => {
        try {
            // Obtener usuario
            const usuario = await Usuario.findByPk(id) as Usuario;

            // Validar si existe
            if (!usuario) {
                reject({
                    status: 404,
                    message: 'Usuario no encontrado'
                });
                return;
            }

            if (data.password && data.password_confirmation && data.password !== data.password_confirmation) {
                reject({
                    status: 400,
                    message: 'Las contraseñas no coinciden'
                });
                return;
            }

            await usuario.update(data);

            resolve({
                status: 200,
                message: 'Usuario actualizado correctamente',
            });

        } catch (error) {
            if (error) {
                reject({
                    status: 500,
                    message: `Error al actualizar el usuario: ${error}`,
                });
            }

            reject({
                status: 500,
                message: 'Error al actualizar'
            });
        }
    });
}

export function obtenerUsuariosPorAdministradorService(
    administrador_id: string,
    query: string = '',
    page: number = 1,
    limit: number = 10
) {
    return new Promise(async (resolve, reject) => {
        try {
            let offset = (page - 1) * limit;

            let params = {
                where: {
                    administrador_id,
                    [Op.and]: {
                        id: {
                            [Op.ne]: administrador_id
                        }
                    },
                    [Op.or]: [
                        {
                            nombre: {
                                [Op.like]: `%${query}%`
                            }
                        },
                        {
                            email: {
                                [Op.like]: `%${query}%`
                            }
                        }
                    ]
                },
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            };

            const usuarios = await Usuario.findAll({
                ...params,
                order: [['createdAt', 'DESC']]
            });

            resolve({
                status: 200,
                message: 'Usuarios encontrados',
                response: {
                    usuarios
                }
            });

        } catch (error) {
            reject({
                status: 500,
                message: 'Error al obtener usuarios'
            });
        }
    });
}

export function obtenerTotalUsuariosPorAdministradorService(
    administrador_id: string,
    query: string = ''
) {
    return new Promise(async (resolve, reject) => {
        try {
            let params = {
                where: {
                    administrador_id,
                    [Op.and]: {
                        id: {
                            [Op.ne]: administrador_id
                        }
                    },
                    [Op.or]: [
                        {
                            nombre: {
                                [Op.like]: `%${query}%`
                            }
                        },
                        {
                            email: {
                                [Op.like]: `%${query}%`
                            }
                        }
                    ]
                }
            };

            const usuarios = await Usuario.findAll({
                ...params,
                order: [['createdAt', 'DESC']]
            });

            resolve({
                status: 200,
                message: 'Usuarios encontrados',
                response: {
                    usuarios: usuarios.length
                }
            });

        } catch (error) {
            reject({
                status: 500,
                message: 'Error al obtener usuarios'
            });
        }
    });
}

export function obtenerUsuarioPorIDService(
    id: string
) {
    return new Promise(async (resolve, reject) => {
        try {
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                reject({
                    status: 404,
                    message: 'Usuario no encontrado'
                });
                return;
            }

            resolve({
                status: 200,
                message: 'Usuario encontrado',
                response: {
                    usuario
                }
            });

        } catch (error) {
            reject({
                status: 500,
                message: 'Error al obtener usuario'
            });
        }
    });
}


export function obtenerUsuariosPorAdministradorConProyectoPorIDService(
    administrador_id: string,
    project_id: string,
) {

    return new Promise(async (resolve, reject) => {
        try {
            let params = {
                where: {
                    administrador_id,
                    [Op.and]: {
                        id: {
                            [Op.ne]: administrador_id
                        }
                    }
                },
                order: [['createdAt', 'DESC']]
            };

            let usuarios: any = await Usuario.findAll({
                ...params,
                order: [['createdAt', 'DESC']]
            });

            if (usuarios) {
                for (const usuario of usuarios) {
                    const proyecto = await UsuarioProyectos.findOne({
                        where: {
                            usuario_id: usuario.id,
                            proyecto_id: project_id
                        }
                    });

                    if (proyecto) {
                        usuario.dataValues.proyecto = proyecto.dataValues;
                    }
                }
            }

            resolve({
                status: 200,
                message: 'Usuarios encontrados',
                response: {
                    usuarios
                }
            });

        } catch (error) {
            reject({
                status: 500,
                message: 'Error al obtener usuarios'
            });
        }
    });
}