'use strict'

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize

  const Project = app.model.define('project', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    description: STRING,
    owner: STRING(20),
    repositoryType: { type: STRING(20), defaultValue: 'GIT' },
    repositoryUrl: STRING,
    postEmails: STRING(500),
    gitlabId: { type: INTEGER, unique: true },
    createdTime: DATE,
    updatedTime: DATE
  })

  return Project
}
