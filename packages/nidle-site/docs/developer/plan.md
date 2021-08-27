---
id: plan
---

# 任务计划

## 一期 - 调度器计划
* 调度器类
	* 要定义出属性，比如 `给插件任务的task实例`等
	* 要控制生命周期，做相关处理
* 配置解析
	* 继承
	* 要检查input和上次是否有变化，无变化可告知用户可以复用上次input
	* 要决定哪些属性开放（挂载到task实例）、哪些属性不开放
* 插件依赖挂载（顺序、并行）
	* 通过`p-cancelable`将插件封装成可取消的Promise
	* 将任务添加到队列`p-series`、`p-parallel`
	* 每个stage最后还要把`complete`添加到队列
	* 如果关闭了并行操作，要将并行任务添加到顺序队列，并warning
* input获取
	* group输出
* 调度器
	* 支持从任意stage开始
	* 支持取消
	* 失败处理
* Stage complete
	* 记录备份
	* 失败处理
* Complete - 任务完成处理
	* 记录备份
* 日志处理
	* 日志写入
	* 失败日志抽离备份
	* 要考虑日志解析
* 文件备份
	* 文件备份
* plugin-clone
	* git clone
* plugin-shell
	* shell命令执行
	* 错误捕获
