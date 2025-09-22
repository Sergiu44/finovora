module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("accounts", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      accountTypeId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: "account-types",
          },
          key: "id",
        },
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      balance: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
      },
      currencyId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: "currencies",
          },
          key: "id",
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("accounts");
  },
};
