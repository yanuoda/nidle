'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { INTEGER } = Sequelize.DataTypes
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn('member', 'status', { type: INTEGER, defaultValue: 0 }, { transaction: t })
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const { INTEGER } = Sequelize.DataTypes
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn('member', 'status', { type: INTEGER }, { transaction: t })
    })
  }
}
