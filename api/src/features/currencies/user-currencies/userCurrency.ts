import { DataTypes, Sequelize, Optional, NonAttribute } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import User from "../../users/user";
import { Currency } from "../currency";

type UserCurrencyAttributes = {
    id: number;
    userId: number;
    currencyId: number;
    isPrimary: boolean;
    createdAt: Date;
};

type UserCurrencyCreationAttributes = Optional<
    UserCurrencyAttributes,
    "id" | "createdAt" | "isPrimary"
>;

@Table({
    tableName: "user-currencies",
    freezeTableName: true,
    timestamps: false,
    indexes: [
        {
            name: "user_currencies_unique_user_currency_idx",
            fields: ["userId", "currencyId"],
            unique: true,
        },
    ],
})
export class UserCurrency extends Model<
    UserCurrencyAttributes,
    UserCurrencyCreationAttributes
> {
    declare id: number;
    declare userId: number;
    declare currencyId: number;
    declare isPrimary: boolean;
    declare createdAt: Date;

    // Associations
    declare user?: NonAttribute<User>;
    declare currency?: NonAttribute<Currency>;

    static associate() {
        UserCurrency.belongsTo(User, {
            foreignKey: "userId",
            as: "user",
        });
        UserCurrency.belongsTo(Currency, {
            foreignKey: "currencyId",
            as: "currency",
        });
    }

    public static configInit(SequelizeInstance: Sequelize) {
        UserCurrency.init(
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
                        model: User,
                        key: "id",
                    },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
                currencyId: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    references: {
                        model: Currency,
                        key: "id",
                    },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
                isPrimary: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            {
                sequelize: SequelizeInstance,
                timestamps: false,
                tableName: "user-currencies",
                freezeTableName: true,
            }
        );
    }
}

