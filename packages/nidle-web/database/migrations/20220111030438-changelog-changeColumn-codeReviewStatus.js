'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { ENUM } = Sequelize.DataTypes
    return Promise.all([
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn(
          'changelog',
          'codeReviewStatus',
          { type: ENUM, values: ['NEW', 'PENDING', 'SUCCESS', 'FAIL'] },
          { transaction: t }
        )
      })
    ])
  },
  down: (queryInterface, Sequelize) => {
    const { ENUM } = Sequelize.DataTypes
    return Promise.all([
      queryInterface.sequelize.transaction(t => {
        return queryInterface.changeColumn(
          'changelog',
          'codeReviewStatus',
          { type: ENUM, values: ['NEW', 'SUCCESS', 'FAIL'] },
          { transaction: t }
        )
      })
    ])
  }
}
