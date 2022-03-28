# `nidle-plugin-merge`

> nidle plugin of git merge request. support github & gitlab.

## Install
```
npm install nidle-plugin-merge
```

## Usage
代码合并依赖于团队的「分支管理」。目前我们团队是这样维护的：
* **日常分支**: 随意，开发者在日常开发过程从 `master` 拉取本地分支，发布时再根据情况 `merge` 最新的 `master` 分支，并推送到远程；
* **release分支**: `受保护`；发布生产前的一道坎，发布日常测试没问题，并进行 `codeReview` 后才会将 `本地分支` 合并到 `release` 分支；*如果临期不发布，只需 revert release 分支，避免过多操作主干*
* **master分支**: `受保护`；主干分支，永远跟生产环境代码保持一致；发布生产时会自动将 `release` 合并到 `master` 分支，并删除远程日常分支；

## Configuration
* **apiUrl**: git api base url；
* **privateToken**: git Personal Access Token；
* **sourceBranch**: 源分支；`required: false`, 默认当前分支
* **targetBranch**: 目标分支；
* **codeReview**: 是否需要codeReview；默认 `false`；如果设为 `true`，那么发布控制会等待 `access merge request` 后才可以进入下一个发布环境；
* **autoMerge**: 是否自动通过 `merge request`；默认 `false`；
* **removeSourceBranch**: 是否删除当前远程分支；默认 `false`；

## 注意
`codeReview` 依赖 `git webhook`. 参照[webhook章节](https://yanuoda.github.io/nidle/docs/document/basic/webhook)
