import {
  DataTypes,
  NonAttribute,
  Optional,
  Sequelize,
} from "sequelize";
import { Model, Table } from "sequelize-typescript";
import User from "../user";

export type ProfileSetupSessionStatus =
  | "active"
  | "completed"
  | "expired";

type ProfileSetupSessionAttributes = {
  id: number;
  userId: number;
  token: string;
  status: ProfileSetupSessionStatus;
  expiresAt: Date;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type ProfileSetupSessionCreationAttributes = Optional<
  ProfileSetupSessionAttributes,
  "id" | "status" | "completedAt" | "createdAt" | "updatedAt"
>;

@Table({
  tableName: "profile-setup-sessions",
  timestamps: true,
})
export class ProfileSetupSession extends Model<
  ProfileSetupSessionAttributes,
  ProfileSetupSessionCreationAttributes
> {
  declare id: number;
  declare userId: number;
  declare token: string;
  declare status: ProfileSetupSessionStatus;
  declare expiresAt: Date;
  declare completedAt?: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare user?: NonAttribute<User>;

  static associate() {
    ProfileSetupSession.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  static configInit(SequelizeInstance: Sequelize) {
    ProfileSetupSession.init(
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
            model: "users",
            key: "id",
          },
        },
        token: {
          type: DataTypes.STRING(191),
          allowNull: false,
          unique: true,
        },
        status: {
          type: DataTypes.ENUM("active", "completed", "expired"),
          allowNull: false,
          defaultValue: "active",
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        completedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        sequelize: SequelizeInstance,
        tableName: "profile-setup-sessions",
      }
    );
  }
}

