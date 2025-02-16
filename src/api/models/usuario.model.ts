import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BeforeCreate } from 'sequelize-typescript';
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
        allowNull: false,
    }) administrador_id!: number;

    @BelongsTo(() => Administrador)
    administrador!: Administrador;

    @BeforeCreate
    static async hashPassword(usuario: Usuario) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
    }
}