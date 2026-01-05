module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("user-currencies", {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            currencyId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "currencies",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            isPrimary: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });

        await queryInterface.addIndex("user-currencies", ["userId", "currencyId"], {
            name: "user_currencies_unique_user_currency_idx",
            unique: true,
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("user-currencies");
    }
}