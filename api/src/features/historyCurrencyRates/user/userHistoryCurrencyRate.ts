import { DataTypes, NonAttribute, Optional, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import { Currency } from "../../currencies/currency";
import User from "../../users/user";

type UserHistoryCurrencyRateAttributes = {
  id: number;
  baseCurrencyId: number;
  targetCurrencyId: number;
  userId: number;
  rate: number;
  rateDate: Date;
  syncDate: Date;
};

type UserHistoryCurrencyRateCreationAttributes = Optional<
  UserHistoryCurrencyRateAttributes,
  "id"
>;

@Table({
  tableName: "user-history-currency-rates",
  timestamps: false,
  freezeTableName: true,
})
export class UserHistoryCurrencyRate extends Model<
  UserHistoryCurrencyRateAttributes,
  UserHistoryCurrencyRateCreationAttributes
> {
  declare id: number;
  declare baseCurrencyId: number;
  declare targetCurrencyId: number;
  declare userId: number;
  declare rate: number;
  declare rateDate: Date;
  declare syncDate: Date;
  declare baseCurrency: NonAttribute<Currency>;
  declare targetCurrency: NonAttribute<Currency>;
  declare user: NonAttribute<User>;

  static associate() {
    UserHistoryCurrencyRate.belongsTo(Currency, {
      foreignKey: "baseCurrencyId",
      as: "baseCurrency",
    });
    UserHistoryCurrencyRate.belongsTo(Currency, {
      foreignKey: "targetCurrencyId",
      as: "targetCurrency",
    });
    UserHistoryCurrencyRate.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
    });
  }

  static configInit(SequelizeInstance: Sequelize) {
    UserHistoryCurrencyRate.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        baseCurrencyId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: Currency,
            key: "id",
          },
        },
        targetCurrencyId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: Currency,
            key: "id",
          },
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: User,
            key: "id",
          },
        },
        rate: {
          type: DataTypes.DECIMAL(20, 10),
          allowNull: false,
        },
        rateDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        syncDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        sequelize: SequelizeInstance,
        tableName: "history-currency-rates",
        timestamps: false,
        freezeTableName: true,
      }
    );
  }
}
