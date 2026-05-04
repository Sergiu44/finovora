import { DataTypes, Optional, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import { DateUtils } from "../../utils/utilities/DateUtils";

type SessionAttributes = {
  id: number;
  userId: number;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
};

type SessionCreationAttributes = Optional<SessionAttributes, "expiresAt" | "id" | "createdAt">;

@Table({
  tableName: "sessions",
  timestamps: false,
})
export class Session extends Model<SessionAttributes, SessionCreationAttributes> {
  declare id: number;
  declare userId: number;
  declare userAgent?: string;
  declare expiresAt: Date;
  declare createdAt: Date;

  public static configInit(SequelizeInstance: Sequelize) {
    Session.init(
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
          onDelete: "CASCADE"
        },
        userAgent: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Date.now(),
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DateUtils.thirtyDaysFromNow(),
        },
      },
      {
        sequelize: SequelizeInstance,
        timestamps: false,
      }
    );
  }
}
