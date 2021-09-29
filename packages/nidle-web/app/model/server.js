'use strict'

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize

  const Server = app.model.define('server', {
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

  return Server
}
