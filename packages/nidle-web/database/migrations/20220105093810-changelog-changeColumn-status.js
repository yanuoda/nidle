'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { ENUM } = Sequelize.DataTypes
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn(
        'changelog',
        'status',
        { type: ENUM, values: ['NEW', 'PENDING', 'SUCCESS', 'FAIL', 'CANCEL'] },
        { transaction: t }
      )
    })
  },
  down: (queryInterface, Sequelize) => {
    const { INTEGER } = Sequelize.DataTypes
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn('changelog', 'status', { type: INTEGER }, { transaction: t })
    })
  }
}
