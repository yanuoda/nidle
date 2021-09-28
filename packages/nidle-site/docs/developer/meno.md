---
id: meno
---

# 备忘录

## 疑问
:::note 1. 状态修改，如何控制修改数据库 
web提供一个只做状态修改的方法进来，只有调度器本身调用，不暴露给插件
:::

:::note 2. 如何像terminal那样输出日志
`execa` async process `stdout.pipe()` 可以将流输出到指定文件流
:::

## 记录
1. 任务取消时，shell plugin需要在`cancel()`主动关闭进程 [规范]
2. 应用
  * 是不是要区分环境，而且比如可以没有预发布环境
  * 发布服务器没有维护
  * 不同环境配置没有维护
  * 可能要把`project-server 应用服务表`改下，维护环境相关配置
3. web应用要负责保证用户input输入体验，具体细节还得考虑，包括changelog里保存的config关系，如何查找上一次config
