import { DataTypes, Optional, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import { compareValues } from "../../utils/utilities/bcrypt";

type UserAttributes = {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "firstName" | "lastName" | "verified" | "createdAt" | "updatedAt" | "deletedAt"
>;

@Table({
  tableName: "users",
  timestamps: true,
})
export default class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare firstName?: string;
  declare lastName?: string;
  declare email: string;
  declare password: string;
  declare verified: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;

  public omitPassword(): Omit<UserAttributes, "password"> {
    const { password, ...userWithoutPassword } = this.dataValues;
    return userWithoutPassword;
  }
  public async comparePassword(val: string): Promise<boolean> {
    return await compareValues(val, this.dataValues.password);
  }

  public static configInit(SequelizeInstance: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        firstName: DataTypes.TEXT,
        lastName: DataTypes.TEXT,
        deletedAt: {
          type: DataTypes.DATE,
          defaultValue: null,
        },
      },
      {
        sequelize: SequelizeInstance,
        tableName: "users",
      }
    );
  }
}
