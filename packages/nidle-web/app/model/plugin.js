'use strict'

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize

  const Plugin = app.model.define('plugin', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    description: STRING(30),
    package: STRING(30),
    version: STRING(20),
    installStatus: INTEGER,
    status: INTEGER,
    createdTime: DATE,
    updatedTime: DATE
  })

  return Plugin
}
