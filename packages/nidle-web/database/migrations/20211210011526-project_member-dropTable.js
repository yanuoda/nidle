'use strict'

module.exports = {
  up: async queryInterface => {
    await queryInterface.dropTable('project_member')
  },

  down: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize
    await queryInterface.createTable('project_member', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      project: INTEGER,
      member: INTEGER,
      role: STRING(30),
      createdTime: DATE,
      updatedTime: DATE
    })
  }
}
