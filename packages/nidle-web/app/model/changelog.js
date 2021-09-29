'use strict'

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize

  const Changelog = app.model.define('changelog', {
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

  return Changelog
}
