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
    await queryInterface.createTable('project', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(30),
      description: STRING(30),
      owner: STRING(20),
      repositoryType: STRING(20),
      repositoryUrl: STRING(50),
      postEmails: STRING(500),
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
    await queryInterface.dropTable('project')
  }
}
