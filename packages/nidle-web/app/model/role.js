'use strict'

module.exports = app => {
  const { INTEGER, DATE, STRING, TEXT } = app.Sequelize

  const Role = app.model.define('role', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    code: STRING(20),
    description: STRING(30),
    permision: TEXT('long'),
    status: INTEGER,
    createdTime: DATE,
    updatedTime: DATE
  })

  return Role
}
