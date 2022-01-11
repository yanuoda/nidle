'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { ENUM } = Sequelize.DataTypes
    return Promise.all([
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn(
          'changelog',
          'status',
          { type: ENUM, values: ['NEW', 'PENDING', 'SUCCESS', 'FAIL', 'CANCEL'] },
          { transaction: t }
        )
      }),
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn(
          'changelog',
          'codeReviewStatus',
          { type: ENUM, values: ['NEW', 'SUCCESS', 'FAIL'] },
          { transaction: t }
        )
      })
    ])
  },
  down: (queryInterface, Sequelize) => {
    const { INTEGER } = Sequelize.DataTypes
    return Promise.all([
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn('changelog', 'status', { type: INTEGER }, { transaction: t })
      }),
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn('changelog', 'codeReviewStatus', { type: INTEGER }, { transaction: t })
      })
    ])
  }
}
