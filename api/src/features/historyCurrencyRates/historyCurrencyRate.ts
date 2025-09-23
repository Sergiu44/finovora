import { DataTypes, NonAttribute, Optional, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import { Currency } from "../currencies/currency";

type HistoryCurrencyRateAttributes = {
  id: number;
  baseCurrencyId: number;
  targetCurrencyId: number;
  rate: number;
  rateDate: Date;
  syncDate: Date;
};

type HistoryCurrencyRateCreationAttributes = Optional<
  HistoryCurrencyRateAttributes,
  "id"
>;

@Table({
  tableName: "history-currency-rates",
  timestamps: false,
  freezeTableName: true,
})
export class HistoryCurrencyRate extends Model<
  HistoryCurrencyRateAttributes,
  HistoryCurrencyRateCreationAttributes
> {
  declare id: number;
  declare baseCurrencyId: number;
  declare targetCurrencyId: number;
  declare rate: number;
  declare rateDate: Date;
  declare syncDate: Date;
  declare baseCurrency: NonAttribute<Currency>;
  declare targetCurrency: NonAttribute<Currency>;

  static associate() {
    HistoryCurrencyRate.belongsTo(Currency, {
      foreignKey: "baseCurrencyId",
      as: "baseCurrency",
    });
    HistoryCurrencyRate.belongsTo(Currency, {
      foreignKey: "targetCurrencyId",
      as: "targetCurrency",
    });
  }

  static configInit(SequelizeInstance: Sequelize) {
    HistoryCurrencyRate.init(
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
