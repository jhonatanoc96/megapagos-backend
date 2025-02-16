import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { UsuarioProyectoInterface } from '@interfaces/usuario-proyecto.interface';
import { Usuario } from './usuario.model';
import { Proyecto } from './proyecto.model';

@Table({
    timestamps: true,
    paranoid: false,
})
export class UsuarioProyectos extends Model<UsuarioProyectoInterface> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
    }) id!: number;

    @ForeignKey(() => Usuario)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    }) usuario_id!: number;

    @ForeignKey(() => Proyecto)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    }) proyecto_id!: number;
}