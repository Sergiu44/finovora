import { DataTypes, Sequelize, Optional, NonAttribute } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import { Currency } from "../currency";

type CurrencyExchangeAttributes = {
  id: number;
  baseCurrencyCode: string;
  targetCurrencyCode: string;
  rate: number;
  source: string;
  rateDate: Date;
  syncDate: Date;
};

type CurrencyExchangeCreationAttributes = Optional<
  CurrencyExchangeAttributes,
  "id" | "syncDate"
>;

@Table({
  tableName: "currencies-exchange",
  freezeTableName: true,
  timestamps: false,
  indexes: [
    {
      name: "currencies_exchange_base_code_idx",
      fields: ["baseCurrencyCode"],
    },
    {
      name: "currencies_exchange_target_code_idx",
      fields: ["targetCurrencyCode"],
    },
    {
      name: "currencies_exchange_unique_base_target_idx",
      fields: ["baseCurrencyCode", "targetCurrencyCode"],
      unique: true
    },
  ],
})
export class CurrencyExchange extends Model<
  CurrencyExchangeAttributes,
  CurrencyExchangeCreationAttributes
> {
  declare id: number;
  declare baseCurrencyCode: string;
  declare targetCurrencyCode: string;
  declare rate: number;
  declare source: string;
  declare rateDate: Date;
  declare syncDate: Date;

  // Associations
  declare baseCurrency?: NonAttribute<Currency>;
  declare targetCurrency?: NonAttribute<Currency>;

  static associate() {
    CurrencyExchange.belongsTo(Currency, {
      foreignKey: "baseCurrencyCode",
      targetKey: "code",
      as: "baseCurrency",
    });
    CurrencyExchange.belongsTo(Currency, {
      foreignKey: "targetCurrencyCode",
      targetKey: "code",
      as: "targetCurrency",
    });
  }

  public static configInit(SequelizeInstance: Sequelize) {
    CurrencyExchange.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        baseCurrencyCode: {
          type: DataTypes.STRING(10), // e.g., 'USD', 'EUR', 'RON'
          allowNull: false,
          references: {
            model: Currency,
            key: "code",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        targetCurrencyCode: {
          type: DataTypes.STRING(10), // e.g., 'USD', 'EUR', 'RON'
          allowNull: false,
          references: {
            model: Currency,
            key: "code",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        rate: {
          type: DataTypes.DECIMAL(20, 10),
          allowNull: false,
        },
        source: {
          type: DataTypes.STRING(100),
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
        timestamps: false,
        tableName: "currencies-exchange",
        freezeTableName: true,
      }
    );
  }
}

