'use strict'

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize

  const Member = app.model.define('member', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    login: STRING(30),
    name: STRING(30),
    password: STRING(20),
    role: INTEGER,
    status: INTEGER,
    createdTime: DATE,
    updatedTime: DATE
  })

  return Member
}
