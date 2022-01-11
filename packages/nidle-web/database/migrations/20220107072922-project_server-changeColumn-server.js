'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER } = Sequelize.DataTypes
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn(
        'project_server',
        'server',
        {
          type: INTEGER,
          references: {
            model: 'server',
            key: 'id'
          }
        },
        { transaction: t }
      )
    })
  },
  down: (queryInterface, Sequelize) => {
    const { INTEGER } = Sequelize.DataTypes
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn(
        'project_server',
        'server',
        {
          type: INTEGER
        },
        { transaction: t }
      )
    })
  }
}
