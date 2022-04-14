'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.addColumn(
        'member',
        'githubUserId',
        { type: Sequelize.DataTypes.INTEGER, unique: true },
        { transaction: t }
      )
    })
  },
  down: queryInterface => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeColumn('member', 'githubUserId', { transaction: t })
    })
  }
}
