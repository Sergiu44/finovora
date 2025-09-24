module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("transactions", "destinationAccountId", {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: {
          tableName: "accounts",
        },
        key: "id",
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("transactions", "destinationAccountId");
  },
};
