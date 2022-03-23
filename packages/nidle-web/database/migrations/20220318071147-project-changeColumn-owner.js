'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { STRING } = Sequelize.DataTypes
    return Promise.all([
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn(
          'project',
          'owner',
          { type: Sequelize.DataTypes.STRING(100) },
          { transaction: t }
        )
      }),
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn(
          'project',
          'repositoryType',
          { type: STRING(20), defaultValue: 'GitLab' },
          { transaction: t }
        )
      })
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const { STRING } = Sequelize.DataTypes
    return Promise.all([
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn(
          'project',
          'owner',
          { type: Sequelize.DataTypes.STRING(20) },
          { transaction: t }
        )
      }),
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn(
          'project',
          'repositoryType',
          { type: STRING(20), defaultValue: 'GIT' },
          { transaction: t }
        )
      })
    ])
  }
}
