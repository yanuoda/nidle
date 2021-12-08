'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn(
        'project',
        'repositoryUrl',
        { type: Sequelize.DataTypes.STRING },
        { transaction: t }
      )
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn(
        'project',
        'repositoryUrl',
        { type: Sequelize.DataTypes.STRING(50) },
        { transaction: t }
      )
    })
  }
}
