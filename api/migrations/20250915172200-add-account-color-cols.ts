module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "accounts",
        "defaultGradientId",
        {
          type: Sequelize.TINYINT,
          references: {
            model: {
              tableName: "default-gradients",
            },
            key: "id",
          },
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "accounts",
        "userGradientId",
        {
          type: Sequelize.BIGINT,
          references: {
            model: {
              tableName: "user-gradients",
            },
            key: "id",
          },
        },
        { transaction }
      );

      await queryInterface.addConstraint(
        "accounts",
        {
          fields: ["defaultGradientId", "userGradientId"],
          type: "check",
          name: "chk_exactly_one_gradient_reference",
          where: {
            [Sequelize.Op.or]: [
              // Either defaultGradientId has value AND userGradientId is null
              {
                [Sequelize.Op.and]: [
                  { defaultGradientId: { [Sequelize.Op.ne]: null } },
                  { userGradientId: { [Sequelize.Op.eq]: null } },
                ],
              },
              // OR userGradientId has value AND defaultGradientId is null
              {
                [Sequelize.Op.and]: [
                  { defaultGradientId: { [Sequelize.Op.eq]: null } },
                  { userGradientId: { [Sequelize.Op.ne]: null } },
                ],
              },
            ],
          },
        },
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Drop constraint first
      await queryInterface.removeConstraint(
        "accounts",
        "chk_exactly_one_gradient_reference",
        { transaction }
      );

      // Then remove the columns in reverse order
      await queryInterface.removeColumn("accounts", "userGradientId", {
        transaction,
      });

      await queryInterface.removeColumn("accounts", "defaultGradientId", {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
