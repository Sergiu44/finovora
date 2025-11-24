module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("transactions", "currencyId", {
            type: Sequelize.BIGINT,
            allowNull: true,
            references: {
                model: "currencies",
                key: "id",
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.removeColumn("transactions", "currencyId");
    }
}