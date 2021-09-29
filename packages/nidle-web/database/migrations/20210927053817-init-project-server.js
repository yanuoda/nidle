'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { INTEGER, DATE, STRING } = Sequelize
    await queryInterface.createTable('project_server', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      project: INTEGER,
      environment: STRING(20),
      server: INTEGER,
      output: STRING(),
      createdTime: DATE,
      updatedTime: DATE
    })
  },

  down: async queryInterface => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('project_server')
  }
}
