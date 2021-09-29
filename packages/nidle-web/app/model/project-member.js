'use strict'

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize

  const ProjectMember = app.model.define('project_member', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    project: INTEGER,
    member: INTEGER,
    role: INTEGER,
    createdTime: DATE,
    updatedTime: DATE
  })

  return ProjectMember
}
