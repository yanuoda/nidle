'use strict'

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize

  const Project = app.model.define('project', {
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

  return Project
}
