import { Proyecto } from '../models/proyecto.model';
import { UsuarioProyectos } from '../models/usuario-proyecto.model';

export async function crearService(
    usuario_id: string,
    proyecto_id: string
) {

    return new Promise(async (resolve, reject) => {
        try {

            const usuarioProyecto = new UsuarioProyectos();

            usuarioProyecto.usuario_id = parseInt(usuario_id);
            usuarioProyecto.proyecto_id = parseInt(proyecto_id);

            await usuarioProyecto.save();

            resolve({
                status: 200,
                message: `Proyecto asociado correctamente`,
            });

        } catch (error: any) {
            if (error) {
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
    usuario_id: string,
    proyecto_id: string
) {

    return new Promise(async (resolve, reject) => {
        try {
            const usuarioProyecto = await UsuarioProyectos.findOne({
                where: {
                    usuario_id: parseInt(usuario_id),
                    proyecto_id: parseInt(proyecto_id)
                }
            });

            // Validar si existe
            if (!usuarioProyecto) {
                reject({
                    status: 404,
                    message: 'proyecto no encontrado'
                });
                return;
            }

            await usuarioProyecto.destroy();

            resolve({
                status: 200,
                message: 'Proyecto desasociado correctamente',
                response: {
                    usuarioProyecto
                }
            });

        } catch (error: any) {
            if (error) {
                reject({
                    status: 500,
                    message: `Error al eliminar el registro: ${error}`,
                });
            }

            reject({
                status: 500,
                message: 'Error al eliminar'
            });
        }
    });
}

export function obtenerProyectosPorUsuariosAsociadosService(
    usuario_id: string
) {

    return new Promise(async (resolve, reject) => {
        try {
            const usuarioProyectos = await UsuarioProyectos.findAll({
                where: {
                    usuario_id
                }
            });

            if (!usuarioProyectos) {
                reject({
                    status: 404,
                    message: 'Registros no encontrados'
                });
                return;
            }

            const proyectosIds = usuarioProyectos.map((usuarioProyecto) => usuarioProyecto.proyecto_id);

            const proyectos = await Proyecto.findAll({
                where: {
                    id: proyectosIds
                }
            });

            if (!proyectos) {
                reject({
                    status: 404,
                    message: 'Proyectos no encontrados'
                });
                return;
            }

            resolve({
                status: 200,
                message: 'Proyectos obtenidos correctamente',
                response: {
                    proyectos
                }
            });

        } catch (error: any) {
            if (error) {
                reject({
                    status: 500,
                    message: `Error al obtener los registros: ${error}`,
                });
            }

            reject({
                status: 500,
                message: 'Error al obtener'
            });
        }
    });
}