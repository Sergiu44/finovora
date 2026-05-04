import { DataTypes, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import User from "../user";

export type UserGradientAttributes = {
  id: number;
  userId: number;
  name: string;
  slug: string;
  to: string;
  from: string;
};

export type CreateUserGradientAttributes = Omit<UserGradientAttributes, "id">;

@Table({
  tableName: "user-gradients",
  timestamps: false,
})
export class UserGradient extends Model<
  UserGradientAttributes,
  CreateUserGradientAttributes
> {
  declare id: number;
  declare userId: number;
  declare name: string;
  declare slug: string;
  declare to: string;
  declare from: string;

  static associate() {
    UserGradient.belongsTo(User, {
      foreignKey: "userId",
    });
  }

  static configInit(SequelizeInstance: Sequelize) {
    UserGradient.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: {
              tableName: "users",
            },
            key: "id",
          },
          onDelete: "CASCADE"
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        from: {
          type: DataTypes.STRING(7),
          allowNull: false,
        },
        to: {
          type: DataTypes.STRING(7),
          allowNull: false,
        },
      },
      {
        sequelize: SequelizeInstance,
        timestamps: false,
        tableName: "user-gradients",
      }
    );
  }
}
