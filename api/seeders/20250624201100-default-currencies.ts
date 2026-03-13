module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("currencies", [
      {
        id: 1,
        code: "RON",
        name: "Romanian Leu",
        symbol: "RON",
        countryCode: "RO",
      },
      {
        id: 2,
        code: "EUR",
        name: "Euro",
        symbol: "€",
        countryCode: "EU",
      },
      {
        id: 3,
        code: "USD",
        name: "United States Dollar",
        symbol: "$",
        countryCode: "US",
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("currencies", null, {});
  },
};
