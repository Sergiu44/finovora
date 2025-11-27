import {
  DataTypes,
  NonAttribute,
  Optional,
  Sequelize,
} from "sequelize";
import { Model, Table } from "sequelize-typescript";
import User from "../user";

type ThemePreference = "light" | "dark" | "system";

type UserProfileAttributes = {
  id: number;
  userId: number;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  dateOfBirth?: Date | null;
  statusMessage?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  preferredStartDayOfMonth: number;
  themePreference: ThemePreference;
  language: string;
  timezone?: string | null;
  preferredCurrency?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

type UserProfileCreationAttributes = Optional<
  UserProfileAttributes,
  | "id"
  | "firstName"
  | "lastName"
  | "username"
  | "dateOfBirth"
  | "statusMessage"
  | "bio"
  | "avatarUrl"
  | "preferredStartDayOfMonth"
  | "themePreference"
  | "language"
  | "timezone"
  | "preferredCurrency"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
>;

@Table({
  tableName: "user_profiles",
})
export class UserProfile extends Model<
  UserProfileAttributes,
  UserProfileCreationAttributes
> {
  declare id: number;
  declare userId: number;
  declare firstName?: string | null;
  declare lastName?: string | null;
  declare username?: string | null;
  declare dateOfBirth?: Date | null;
  declare statusMessage?: string | null;
  declare bio?: string | null;
  declare avatarUrl?: string | null;
  declare preferredStartDayOfMonth: number;
  declare themePreference: ThemePreference;
  declare language: string;
  declare timezone?: string | null;
  declare preferredCurrency?: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date | null;
  declare user?: NonAttribute<User>;

  static associate() {
    UserProfile.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    User.hasOne(UserProfile, {
      foreignKey: "userId",
      as: "profile",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  static configInit(SequelizeInstance: Sequelize) {
    UserProfile.init(
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
          unique: true,
          references: {
            model: "users",
            key: "id",
          },
        },
        firstName: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        lastName: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        username: {
          type: DataTypes.STRING(100),
          allowNull: true,
          unique: true,
        },
        dateOfBirth: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        statusMessage: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        bio: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        avatarUrl: {
          type: DataTypes.STRING(1024),
          allowNull: true,
        },
        preferredStartDayOfMonth: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        themePreference: {
          type: DataTypes.ENUM("light", "dark", "system"),
          allowNull: false,
          defaultValue: "system",
        },
        language: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: "en",
        },
        timezone: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        preferredCurrency: {
          type: DataTypes.STRING(10),
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
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        sequelize: SequelizeInstance,
        tableName: "user_profiles",
        paranoid: true,
      }
    );
  }
}

