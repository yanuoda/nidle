# nidle-web

`Nidle` 应用层服务

## 开发

第一次运行项目前，需要做数据库的初始化操作：

1. 启动 `mysql` 服务，`redis` 服务
2. 在 `nidle-web` 目录下，创建 `.env` 文件
3. 复制 `.env.example` 内容到你创建的 `.env` 文件里，并修改其中的配置项
4. 在 `nidle-web` 目录下依次运行以下命令即可启动服务：

```bash
# 第一次启动需要进行数据库创建
$ yarn db:create
# 每次更新代码后最好都跑一下 migrate
$ yarn db:migrate
# 启动服务
$ yarn dev
```

## 数据库相关

### 数据库更新操作

对数据库的字段、表进行更新是比较常见的场景。在已经部署的项目里，我们可以利用 `sequelize-cli` 提供的迁移命令来处理这件事情，这里的命令已经进行了封装，详见 `package.json` 的 `scripts` 字段：

```bash
# 生成新的迁移脚本
$ yarn db:migrate:generate --name <文件名时间戳后边跟着的部分>

# 执行所有未执行过的迁移脚本的 up 函数，即更新
$ yarn db:migrate
# 执行最后一个迁移脚本的 down 函数
$ yarn db:migrate:undo
# 执行所有迁移脚本的 down 函数
$ yarn db:migrate:undo:all

# 测试环境同上，做的是测试数据库的迁移
$ yarn test:db:migrate
$ yarn test:db:migrate:undo
$ yarn test:db:migrate:undo:all
```

## Documents

- [eggjs sequelize document](https://eggjs.org/zh-cn/tutorials/mysql.html)
- [egg-sequelize](https://github.com/eggjs/egg-sequelize)
- [sequelize](http://docs.sequelizejs.com)
- [sequelize-cli and migrations](http://docs.sequelizejs.com/manual/tutorial/migrations.html)
- [factory-girl](https://github.com/aexmachina/factory-girl)
