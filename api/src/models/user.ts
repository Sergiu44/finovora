import { DataTypes, NonAttribute, Optional, Sequelize } from "sequelize";
import { HasMany, Model, Table } from "sequelize-typescript";
import { compareValues, hashPassword } from "../../utils/utilities/bcrypt";
import { Account } from "./account";
import { AccountType } from "./accountType";

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
  primaryAccountId?: number;
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
  declare primaryAccountId?: number;

  @HasMany(() => Account, "userId")
  declare accounts: NonAttribute<Account[]>;

  @HasMany(() => AccountType, "userId")
  declare accountTypes: NonAttribute<AccountType[]>;

  public omitPassword(): Omit<UserAttributes, "password"> {
    const { password, ...userWithoutPassword } = this.dataValues;
    return userWithoutPassword;
  }
  public async comparePassword(user: User, val: string): Promise<boolean> {
    return await compareValues(val, user.password);
  }

  public static configInit(SequelizeInstance: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        primaryAccountId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: "accounts",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
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
        hooks: {
          async beforeCreate(attributes) {
            const password = attributes.get("password") as string;
            if (password) {
              const hashedPassword = await hashPassword(password);
              attributes.set("password", hashedPassword);
            }
          },
        },
      }
    );
  }
}
