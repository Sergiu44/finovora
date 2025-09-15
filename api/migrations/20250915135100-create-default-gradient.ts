module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("default-gradients", {
      id: {
        type: Sequelize.TINYINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      color1: {
        type: Sequelize.STRING(7),
        allowNull: false,
      },
      color2: {
        type: Sequelize.STRING(7),
        allowNull: false,
      },
      color3: {
        type: Sequelize.STRING(7),
        allowNull: false,
      },
      color4: {
        type: Sequelize.STRING(7),
        allowNull: false,
      },
      color5: {
        type: Sequelize.STRING(7),
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.deleteTable("default-gradients");
  },
};
