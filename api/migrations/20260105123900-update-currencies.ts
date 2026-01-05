module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("currencies", "countryCode", {
            type: Sequelize.STRING(2),
            allowNull: false,
            unique: true,
        });
    },
    async down(queryInterface) {
        await queryInterface.removeColumn("currencies", "countryCode");
    }
}