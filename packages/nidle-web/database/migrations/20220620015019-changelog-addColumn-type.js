'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.addColumn(
        'changelog',
        'type',
        { type: Sequelize.DataTypes.STRING(20), defaultValue: 'normal' },
        { transaction: t }
      )
    })
  },
  down: queryInterface => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeColumn('changelog', 'type', { transaction: t })
    })
  }
}
