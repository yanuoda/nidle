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
    await queryInterface.createTable('changelog', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      period: STRING(),
      project: INTEGER,
      branch: STRING(30),
      commitId: STRING(),
      developer: INTEGER,
      source: STRING(20),
      status: INTEGER,
      codeReviewStatus: INTEGER,
      environment: STRING(20),
      stage: STRING(20),
      duration: INTEGER,
      configPath: STRING(),
      logPath: STRING(),
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
    await queryInterface.dropTable('changelog')
  }
}
