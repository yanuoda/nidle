'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.addColumn(
        'project_server',
        'changelog',
        { type: Sequelize.DataTypes.INTEGER },
        { transaction: t }
      )
    })
  },
  down: queryInterface => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeColumn('project_server', 'changelog', { transaction: t })
    })
  }
}
