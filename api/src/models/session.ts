import { DataTypes, Optional, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import { thirtyDaysFromNow } from "../../utils/utilities/date";

type SessionAttributes = {
  id: number;
  userId: number;
  userAgent?: string;
  expiresAt: Date;
};

type SessionCreationAttributes = Optional<SessionAttributes, "expiresAt" | "id">;

@Table({
  tableName: "sessions",
  timestamps: false,
})
export class Session extends Model<SessionAttributes, SessionCreationAttributes> {
  declare id: number;
  declare userId: number;
  declare userAgent?: string;
  declare expiresAt: Date;

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
        },
        userAgent: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: thirtyDaysFromNow(),
        },
      },
      {
        sequelize: SequelizeInstance,
        timestamps: false,
      }
    );
  }
}
