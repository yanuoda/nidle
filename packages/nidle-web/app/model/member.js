'use strict'

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize

  const Member = app.model.define('member', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    gitlabUserId: { type: INTEGER },
    githubUserId: { type: INTEGER },
    login: STRING(30),
    name: { type: STRING(30), allowNull: false, unique: true },
    password: STRING(32),
    role: INTEGER,
    status: { type: INTEGER, defaultValue: 0 },
    createdTime: DATE,
    updatedTime: DATE
  })

  return Member
}
