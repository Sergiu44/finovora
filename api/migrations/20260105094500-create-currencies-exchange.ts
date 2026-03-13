module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("currencies-exchange", {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            baseCurrencyCode: {
                type: Sequelize.STRING(10), // e.g., 'USD', 'EUR', 'RON'
                allowNull: false,
                references: {
                    model: "currencies",
                    key: "code",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            targetCurrencyCode: {
                type: Sequelize.STRING(10), // e.g., 'USD', 'EUR', 'RON'
                allowNull: false,
                references: {
                    model: "currencies",
                    key: "code",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            rate: {
                type: Sequelize.DECIMAL(20, 10),
                allowNull: false,
            },
            source: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            rateDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            syncDate: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });

        // Add indexes for faster lookups by currency codes
        await queryInterface.addIndex("currencies-exchange", ["baseCurrencyCode"], {
            name: "currencies_exchange_base_code_idx",
        });

        await queryInterface.addIndex("currencies-exchange", ["targetCurrencyCode"], {
            name: "currencies_exchange_target_code_idx",
        });

        // Composite index for common query pattern: base -> target lookup
        await queryInterface.addIndex("currencies-exchange", ["baseCurrencyCode", "targetCurrencyCode"], {
            name: "currencies_exchange_unique_base_target_idx",
            unique: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("currencies-exchange");
    },
}