'use strict'

const statusEnums = ['NEW', 'PENDING', 'SUCCESS', 'FAIL', 'CANCEL']

module.exports = app => {
  const { INTEGER, DATE, STRING, ENUM, VIRTUAL } = app.Sequelize
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
      values: statusEnums
    },
    statusEnum: {
      type: VIRTUAL,
      get() {
        const rawValue = this.getDataValue('status')
        return statusEnums.indexOf(rawValue)
      }
    },
    codeReviewStatus: {
      type: ENUM,
      values: ['NEW', 'PENDING', 'SUCCESS', 'FAIL']
    },
    environment: STRING(20),
    stage: STRING(20),
    duration: INTEGER,
    active: INTEGER,
    configPath: STRING(),
    logPath: STRING(),
    createdTime: DATE,
    updatedTime: DATE
  })

  return Changelog
}
