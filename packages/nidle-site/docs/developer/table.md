---
id: table
title: 数据库
sidebar_position: 4
---

## 数据库表
### plugin 插件表
* id: uniqueid
* name: string
* description: string
* package: string
* version: string
* installStatus: int - 0: 安装中 1: 安装成功 2: 安装失败
* status: int - 0: 禁用 1: 启用
* createdTime: date-time
* updatedTime: date-time

### template 配置模板表
* id: uniqueid
* name: string
* description: string
* config: text
* status: int - 0: 禁用 1: 启用
* createdTime: date-time
* updatedTime: date-time

### server 服务器表
* id: uniqueid
* name: string
* ip: string
* description: string
* username: string
* password: string
* status: int - 0: 禁用 1: 启用
* createdTime: date-time
* updatedTime: date-time

### role 角色表
* id: uniqueid
* name: string
* code: string
* description: string
* permision: text - 菜单权限list
* status: int - 0: 禁用 1: 启用
* createdTime: date-time
* updatedTime: date-time

### member 用户表
* id: uniqueid
* login: string
* name: string
* password: password
* role: roleId
* status: int - 0: 禁用 1: 启用
* createdTime: date-time
* updatedTime: date-time

### project 应用表
* id: uniqueid
* name: string
* description: string
* template: templateId
* owner: string
* repositoryType: string
* repositoryUrl: string
* postEmails: string - 邮件通知列表
* createdTime: date-time
* updatedTime: date-time

### project-member 应用用户表
* id: uniqueid
* project: projectId
* member: memberId
* role: string
* createdTime: date-time
* updatedTime: date-time

### project-server 应用服务表
* id: uniqueid
* project: projectId
* environment: string
* server: serverId
* output: string
* createdTime: date-time
* updatedTime: date-time

### changelog 构建表（每次构建都会新增记录）
* id: uniqueid
* project: projectId
* branch: string
* tag: string
* developer: memberId
* source: string - 触发方式: CLI、webhook、web
* status: int - 0: 进行中 1: 成功 2: 失败、3: Unstable、4: Aborted、5: Pause
* environment: string - 发布环境
* stage: string
* duration: number - 持续时间
* configPath: string - 配置数据路径（input数据、日志路径都从这个文件拿）
* logPath: string - 日志路径
* createdTime: date-time
* updatedTime: date-time 
