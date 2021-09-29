'use strict'

module.exports = app => {
  const { INTEGER, DATE, STRING, TEXT } = app.Sequelize

  const Template = app.model.define('template', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    description: STRING(30),
    config: TEXT('long'),
    status: INTEGER,
    createdTime: DATE,
    updatedTime: DATE
  })

  return Template
}
