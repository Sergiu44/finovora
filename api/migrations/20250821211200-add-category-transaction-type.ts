module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("categories", "transactionTypeId", {
      type: Sequelize.INTEGER,
      references: {
        model: "transactionTypes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("categories", "transactionTypeId");
  },
};
