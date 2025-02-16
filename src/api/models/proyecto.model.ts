import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { ProyectoInterface } from '@interfaces/proyecto.interface';
import { Administrador } from './administrador.model';

@Table({
    timestamps: true,
    paranoid: false,
})
export class Proyecto extends Model<ProyectoInterface> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
    }) id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    }) nombre!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    }) descripcion!: string;

    @ForeignKey(() => Administrador)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    }) administrador_id!: number;

    @BelongsTo(() => Administrador) administrador!: Administrador;
}