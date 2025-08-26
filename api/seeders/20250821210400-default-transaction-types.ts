module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("transaction-types", [
      { id: 1, name: "Income" },
      { id: 2, name: "Expense" },
      { id: 3, name: "Transfer" },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("transaction-types", null, {});
  },
};
