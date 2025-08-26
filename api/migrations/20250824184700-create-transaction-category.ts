module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaction-categories", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      transactionTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "transaction-types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      parentCategoryId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "transaction-categories",
          },
          key: "id",
        },
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("transaction-categories");
  },
};
