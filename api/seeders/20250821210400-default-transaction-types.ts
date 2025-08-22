module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("transactiontypes", [
      { id: 1, name: "Income" },
      { id: 2, name: "Expense" },
      { id: 3, name: "Transfer" },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("transactionTypes", null, {});
  },
};
