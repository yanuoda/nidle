'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(() => {
      return queryInterface.removeConstraint('project', 'gitlabId', {
        unique: false
      })
    })
  }
}
