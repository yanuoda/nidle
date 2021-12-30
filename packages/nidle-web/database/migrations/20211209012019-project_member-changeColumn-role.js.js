'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn(
        'project_member',
        'role',
        { type: Sequelize.DataTypes.STRING(30) },
        { transaction: t }
      )
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn(
        'project_member',
        'role',
        { type: Sequelize.DataTypes.INTEGER },
        { transaction: t }
      )
    })
  }
}
