module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("currencies", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(10), // e.g., 'USD', 'EUR'
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(50), // e.g., 'US Dollar'
        allowNull: false,
      },
      symbol: {
        type: Sequelize.STRING(10), // e.g., '$', '€'
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("currencies");
  },
};
