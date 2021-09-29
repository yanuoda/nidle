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
    await queryInterface.createTable('server', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(30),
      ip: STRING(20),
      description: STRING(30),
      environment: STRING(20),
      username: STRING(30),
      password: STRING(30),
      status: INTEGER,
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
    await queryInterface.dropTable('server')
  }
}
