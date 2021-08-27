---
id: meno
---

# 备忘录

## 疑问
:::danger 1. 状态修改，如何控制修改数据库 
未解决
:::

:::note 2. 如何像terminal那样输出日志
`execa` async process `stdout.pipe()` 可以将流输出到指定文件流
:::

## 记录
1. 任务取消时，shell plugin需要在`cancel()`主动关闭进程 [规范]
