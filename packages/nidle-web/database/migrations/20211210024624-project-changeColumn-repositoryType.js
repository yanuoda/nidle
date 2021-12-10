'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING } = Sequelize.DataTypes
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn(
        'project',
        'repositoryType',
        { type: STRING(20), defaultValue: 'GIT' },
        { transaction: t }
      )
    })
  },
  down: (queryInterface, Sequelize) => {
    const { STRING } = Sequelize.DataTypes
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn('project', 'repositoryType', { type: STRING(20) }, { transaction: t })
    })
  }
}
