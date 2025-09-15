module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user-gradients", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      from: {
        type: Sequelize.STRING(7),
        allowNull: false,
      },
      to: {
        type: Sequelize.STRING(7),
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.deleteTable("user-gradients");
  },
};
