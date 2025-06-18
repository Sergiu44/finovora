import { Model, Table } from "sequelize-typescript";
import VerificationCodeTypes from "../../utils/constants/verificationCodeTypes";
import { DataTypes, Optional, Sequelize } from "sequelize";

type VerificationCodeAttributes = {
  id: number;
  userId: number;
  type: VerificationCodeTypes;
  expiresAt: Date;
  createdAt: Date;
};

type VerificationCodeCreationAttributes = Optional<VerificationCodeAttributes, "createdAt" | "id">;

@Table({
  tableName: "otp-verifications",
  timestamps: false,
})
export default class VerificationCode extends Model<VerificationCodeAttributes, VerificationCodeCreationAttributes> {
  declare id: number;
  declare userId: number;
  declare type: VerificationCodeTypes;
  declare expiresAt: Date;
  declare createdAt: Date;

  public static configInit(SequelizeInstance: Sequelize) {
    VerificationCode.init(
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: DataTypes.BIGINT,
          references: {
            model: {
              tableName: "users",
            },
            key: "id",
          },
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM("email_verification", "password_reset"),
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize: SequelizeInstance,
        tableName: "opt-verifications",
        timestamps: false,
      }
    );
  }
}
