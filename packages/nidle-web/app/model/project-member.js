'use strict'

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize

  const ProjectMember = app.model.define('project_member', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    project: INTEGER,
    member: INTEGER,
    role: STRING(30),
    createdTime: DATE,
    updatedTime: DATE
  })

  return ProjectMember
}
