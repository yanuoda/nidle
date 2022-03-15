---
id: webhook
sidebar_position: 3
---

# webhook
如果你需要 CodeReview 控制，那么在 review 后需要通过 `accept or close merge request` 来更新审核状态，所以需要给代码仓库设置 `webhook`。

我们提供了 merge request API:
`http://server_name/api/changelog/mergeHook`
