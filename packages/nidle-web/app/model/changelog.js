'use strict'

module.exports = app => {
  const { INTEGER, DATE, STRING, ENUM } = app.Sequelize
  const Changelog = app.model.define('changelog', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    period: STRING(),
    project: INTEGER,
    branch: STRING(30),
    commitId: STRING(),
    developer: INTEGER,
    source: STRING(20),
    status: {
      type: ENUM,
      values: ['NEW', 'PENDING', 'SUCCESS', 'FAIL', 'CANCEL']
    },
    codeReviewStatus: {
      type: ENUM,
      values: ['NEW', 'SUCCESS', 'FAIL']
    },
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
