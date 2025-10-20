module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("transactions", "fixed", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("transactions", "dayOfMonth", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("transactions", "fixed");
    await queryInterface.removeColumn("transactions", "dayOfMonth");
  },
};
