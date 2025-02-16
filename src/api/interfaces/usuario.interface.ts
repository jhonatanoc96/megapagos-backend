export interface UsuarioInterface {
    id: number;
    nombre: string;
    email: string;
    password: string;
    rol: string;
    administrador_id: number;
}