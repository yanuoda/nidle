'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn(
          'member',
          'gitlabUserId',
          { type: Sequelize.DataTypes.INTEGER },
          { transaction: t }
        )
      }),
      queryInterface.removeConstraint('member', 'gitlabUserId', {
        unique: false
      }),
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn(
          'member',
          'githubUserId',
          { type: Sequelize.DataTypes.INTEGER },
          { transaction: t }
        )
      }),
      queryInterface.removeConstraint('member', 'githubUserId', {
        unique: false
      })
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn(
          'member',
          'gitlabUserId',
          { type: Sequelize.DataTypes.INTEGER, unique: true },
          { transaction: t }
        )
      }),
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn(
          'member',
          'githubUserId',
          { type: Sequelize.DataTypes.INTEGER, unique: true },
          { transaction: t }
        )
      })
    ])
  }
}
