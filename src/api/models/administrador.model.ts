import { Table, Column, Model, DataType, HasMany, BeforeCreate } from 'sequelize-typescript';
import { AdministradorInterface } from '@interfaces/administrador.interface';
import { Usuario } from './usuario.model';
import { Proyecto } from './proyecto.model';
import bcrypt from 'bcrypt';

@Table({
    timestamps: true,
    paranoid: false,
})
export class Administrador extends Model<AdministradorInterface> {
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

    @HasMany(() => Usuario)
    usuarios!: Usuario[];

    @HasMany(() => Proyecto)
    proyectos!: Proyecto[];

    @BeforeCreate
    static async hashPassword(administrador: Administrador) {
        const salt = await bcrypt.genSalt(10);
        administrador.password = await bcrypt.hash(administrador.password, salt);
    }
}