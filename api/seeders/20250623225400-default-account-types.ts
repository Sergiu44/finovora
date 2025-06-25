module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("account-types", [
      {
        id: 1,
        userId: null,
        name: "Cash",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: null,
        name: "Credit Card",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        userId: null,
        name: "Debit Card",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        userId: null,
        name: "Savings",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        userId: null,
        name: "Other",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        userId: null,
        name: "Investments",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("account-types", {});
  },
};
