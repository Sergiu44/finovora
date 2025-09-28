module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("history-currency-rates", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      baseCurrencyId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "currencies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      targetCurrencyId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "currencies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      rate: {
        type: Sequelize.DECIMAL(20, 10),
        allowNull: false,
      },
      rateDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      syncDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("history-currency-rates");
  },
};
