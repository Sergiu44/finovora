import { DataTypes, Optional, Sequelize, NonAttribute } from "sequelize";
import { Model, Table } from "sequelize-typescript";

type CurrencyAttributes = {
  id: number;
  code: string;
  name: string;
  symbol: string;
  countryCode: string;
};

type CurrencyCreationAttributes = Optional<CurrencyAttributes, "id">;

@Table({
  tableName: "currencies",
  timestamps: false,
})
export class Currency extends Model<CurrencyAttributes, CurrencyCreationAttributes> {
  declare id: number;
  declare code: string;
  declare name: string;
  declare symbol: string;
  declare countryCode: string;

  public static configInit(SequelizeInstance: Sequelize) {
    Currency.init(
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING(10), // e.g., 'USD', 'EUR'
          allowNull: false,
          unique: true,
        },
        countryCode: {
          type: DataTypes.STRING(2),
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING(50), // e.g., 'US Dollar'
          allowNull: false,
        },
        symbol: {
          type: DataTypes.STRING(10), // e.g., '$', '€'
          allowNull: false,
        },
      },
      {
        sequelize: SequelizeInstance,
        timestamps: false,
      }
    );
  }
}
