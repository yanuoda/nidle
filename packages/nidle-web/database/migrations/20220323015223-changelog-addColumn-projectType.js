'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.addColumn(
        'changelog',
        'projectType',
        { type: Sequelize.DataTypes.STRING },
        { transaction: t }
      )
    })
  },
  down: queryInterface => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeColumn('changelog', 'projectType', { transaction: t })
    })
  }
}
