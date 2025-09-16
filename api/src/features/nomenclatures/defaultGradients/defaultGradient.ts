import { DataTypes, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";

type DefaultGradientAttributes = {
  id: number;
  name: string;
  slug: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
};

type CreateDefaultGradientAttributes = Omit<DefaultGradientAttributes, "id">;

@Table({
  tableName: "default-gradients",
  timestamps: false,
})
export class DefaultGradient extends Model<
  DefaultGradientAttributes,
  CreateDefaultGradientAttributes
> {
  declare id: number;
  declare name: string;
  declare slug: string;
  declare color1: string;
  declare color2: string;
  declare color3: string;
  declare color4: string;
  declare color5: string;

  static configInit(SequelizeInstance: Sequelize) {
    DefaultGradient.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        color1: {
          type: DataTypes.STRING(7),
          allowNull: false,
        },
        color2: {
          type: DataTypes.STRING(7),
          allowNull: false,
        },
        color3: {
          type: DataTypes.STRING(7),
          allowNull: false,
        },
        color4: {
          type: DataTypes.STRING(7),
          allowNull: false,
        },
        color5: {
          type: DataTypes.STRING(7),
          allowNull: false,
        },
      },
      {
        tableName: "default-gradients",
        sequelize: SequelizeInstance,
        timestamps: false,
      }
    );
  }
}
