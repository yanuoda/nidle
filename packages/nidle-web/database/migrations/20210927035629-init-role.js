'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { INTEGER, DATE, STRING, TEXT } = Sequelize
    await queryInterface.createTable('role', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(30),
      code: STRING(20),
      description: STRING(30),
      permision: TEXT('long'),
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
    await queryInterface.dropTable('role')
  }
}
