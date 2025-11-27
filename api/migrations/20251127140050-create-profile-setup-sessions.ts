module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("profile-setup-sessions", {
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
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      token: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM("active", "completed", "expired"),
        allowNull: false,
        defaultValue: "active",
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      completedAt: {
        type: Sequelize.DATE,
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
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("profile-setup-sessions");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_profile_setup_sessions_status";'
    );
  },
};

