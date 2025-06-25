module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("currencies", [
      {
        id: 1,
        code: "RON",
        name: "Romanian Leu",
        symbol: "RON",
      },
      {
        id: 2,
        code: "EUR",
        name: "Euro",
        symbol: "€",
      },
      {
        id: 3,
        code: "USD",
        name: "United States Dollar",
        symbol: "$",
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("currencies", null, {});
  },
};
