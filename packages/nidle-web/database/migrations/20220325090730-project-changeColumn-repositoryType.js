'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn(
        'project',
        'repositoryType',
        { type: Sequelize.DataTypes.STRING(20), defaultValue: 'gitlab' },
        { transaction: t }
      )
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn(
        'project',
        'repositoryType',
        { type: Sequelize.DataTypes.STRING(20), defaultValue: 'GitLab' },
        { transaction: t }
      )
    })
  }
}
