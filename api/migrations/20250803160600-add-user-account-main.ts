module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "primaryAccountId", {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "accounts", // name of the target table
        key: "id", // key in the target table to reference
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("users", "primaryAccountId");
  },
};
