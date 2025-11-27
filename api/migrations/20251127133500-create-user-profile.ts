module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_profiles", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      firstName: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      statusMessage: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      avatarUrl: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      preferredStartDayOfMonth: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      
      themePreference: {
        type: Sequelize.ENUM("light", "dark", "system"),
        allowNull: false,
        defaultValue: "system",
      },
      language: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "en",
      },
      timezone: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      preferredCurrency: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_profiles");
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS \"enum_user_profiles_themePreference\";"
    );
  },
}