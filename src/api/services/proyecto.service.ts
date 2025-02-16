import { Proyecto } from '../models/proyecto.model';

export async function crearService(
    administrador_id: string,
    nombre: string,
    descripcion: string = ''
) {

    return new Promise(async (resolve, reject) => {
        try {

            const proyecto = new Proyecto();

            proyecto.nombre = nombre;
            proyecto.descripcion = descripcion;
            proyecto.administrador_id = parseInt(administrador_id);

            await proyecto.save();

            resolve({
                status: 200,
                message: `El proyecto ${nombre} ha sido creado correctamente`,
            });

        } catch (error: any) {
            if (error) {
                if (error.toString().includes('SequelizeUniqueConstraintError')) {
                    reject({
                        status: 400,
                        message: `El proyecto ${nombre} ya existe`,
                    });
                }

                reject({
                    status: 500,
                    message: `Error al crear: ${error}`,
                });
            }

            reject({
                status: 500,
                message: 'Error al crear'
            });
        }
    });
}

export async function eliminarService(
    id: string,
) {

    return new Promise(async (resolve, reject) => {
        try {
            const proyecto = await Proyecto.findByPk(id) as Proyecto;

            // Validar si existe
            if (!proyecto) {
                reject({
                    status: 404,
                    message: 'proyecto no encontrado'
                });
                return;
            }

            await proyecto.destroy();

            resolve({
                status: 200,
                message: 'Proyecto eliminado correctamente',
                response: {
                    proyecto
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
            // Obtener proyecto
            const proyecto = await Proyecto.findByPk(id) as Proyecto;

            // Validar si existe
            if (!proyecto) {
                reject({
                    status: 404,
                    message: 'Proyecto no encontrado'
                });
                return;
            }

            await proyecto.update(data);

            resolve({
                status: 200,
                message: 'Proyecto actualizado correctamente',
            });

        } catch (error) {
            if (error) {
                reject({
                    status: 500,
                    message: `Error al actualizar el proyecto: ${error}`,
                });
            }

            reject({
                status: 500,
                message: 'Error al actualizar'
            });
        }
    });
}

export function obtenerProyectosPorAdministradorService(
    administrador_id: string
) {
    return new Promise(async (resolve, reject) => {
        try {
            const proyectos = await Proyecto.findAll({
                where: {
                    administrador_id
                }
            });

            resolve({
                status: 200,
                message: 'Proyectos encontrados',
                response: {
                    proyectos
                }
            });

        } catch (error) {
            reject({
                status: 500,
                message: 'Error al obtener proyectos'
            });
        }
    });
}