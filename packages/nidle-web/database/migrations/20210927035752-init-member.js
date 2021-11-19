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
    await queryInterface.createTable('member', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      login: STRING(30),
      name: { type: STRING(30), allowNull: false, unique: true },
      password: STRING(32),
      role: INTEGER,
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
    await queryInterface.dropTable('member')
  }
}
