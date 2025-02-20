import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BeforeCreate, BeforeDestroy, BeforeUpdate } from 'sequelize-typescript';
import { UsuarioInterface } from '@interfaces/usuario.interface';
import { Administrador } from './administrador.model';
import bcrypt from 'bcrypt';
@Table({
    timestamps: true,
    paranoid: false,
})
export class Usuario extends Model<UsuarioInterface> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
    }) id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    }) nombre!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    }) email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    }) password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    }) rol!: string;

    @ForeignKey(() => Administrador)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    }) administrador_id!: number | null;

    @BelongsTo(() => Administrador)
    administrador!: Administrador;

    @BeforeCreate
    static async hashPassword(usuario: Usuario) {
        // Hash password before creating the user
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);

        // If rol == 'administrador', create a new administrador, get id and set to administrador_id
        if (usuario.rol === 'administrador') {
            const administrador = new Administrador();

            administrador.nombre = usuario.nombre;
            administrador.email = usuario.email;
            administrador.password = usuario.password;

            await administrador.save();

            usuario.administrador_id = administrador
                ? administrador.id
                : null;
        }
    }

    @BeforeDestroy
    static async deleteAdmin(usuario: Usuario) {
        // If rol == 'administrador', delete the associated administrador
        if (usuario.rol === 'administrador' && usuario.administrador_id) {
            const administrador = await Administrador.findByPk(usuario.administrador_id);
            if (administrador) {
                await administrador.destroy();
            }
        }
    }

    @BeforeUpdate
    static async updateAdmin(usuario: Usuario) {
        // Hash password before updating the user
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);

        // If rol changes from 'usuario' to 'administrador', create a new administrador
        if (usuario.changed('rol') && usuario.rol === 'administrador') {
            const administrador = new Administrador();

            administrador.nombre = usuario.nombre;
            administrador.email = usuario.email;
            administrador.password = usuario.password;

            await administrador.save();

            usuario.administrador_id = administrador.id;
        } else if (usuario.changed('rol') && usuario.rol !== 'administrador' && usuario.administrador_id) {
            // If rol changes from 'administrador' to something else, delete the associated administrador
            const administrador = await Administrador.findByPk(usuario.administrador_id);
            if (administrador) {
                await administrador.destroy();
            }
            usuario.administrador_id = null;
        } else if (usuario.administrador_id) {
            // If other fields are updated, update the associated administrador
            const administrador = await Administrador.findByPk(usuario.administrador_id);
            if (administrador) {
                administrador.nombre = usuario.nombre;
                administrador.email = usuario.email;
                administrador.password = usuario.password;

                await administrador.save();
            }
        }
    }
}