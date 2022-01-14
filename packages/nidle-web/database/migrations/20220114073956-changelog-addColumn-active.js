'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.addColumn('changelog', 'active', { type: Sequelize.DataTypes.INTEGER }, { transaction: t })
    })
  },
  down: queryInterface => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeColumn('changelog', 'active', { transaction: t })
    })
  }
}
