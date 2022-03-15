---
id: template
sidebar_position: 6
---

# 配置模板管理
如果你有多个同类型的应用，这些应用的部署流程应该是一样的，那么你可以统一设置一个「配置模板」，应用简单继承扩展即可。这样即能保证个应用间统一，又可以灵活定制。

### 如何工作
模板配置其实跟应用配置结构是一样的，只是抽取了公共的部分，避免重复定义；应用中通过`extend: "template name"`即可继承，并可通过`chain`去自定义（参考webpack-chain），详细看[进阶 - 配置](../advanced/config)

### 栗子
我们来简单看一个`Vue assets`类型各个环境的栗子

#### 测试环境
```javascript
{
  "name": "development-assets", 
  "mode": "development",
  "type": "publish", 
  "stages": [
    {
      "name": "download", // 应用下载阶段
      "timeout": 0, 
      "steps": [
        {
          "name": "clone", // git clone
          "enable": true, 
          "package": "nidle-plugin-clone", 
          "timeout": 0, 
          "retry": 0
        },
        {
          "name": "nvm", // 判断应用依赖node版本
          "enable": true, 
          "package": "nidle-plugin-nvm", 
          "timeout": 0, 
          "retry": 0
        },
        {
          "name": "install", // 依赖安装
          "enable": true, 
          "package": "nidle-plugin-install", 
          "timeout": 0, 
          "retry": 0
        },
        {
          "name": "eslint", // 代码扫描
          "enable": true, 
          "package": "nidle-plugin-eslint", 
          "timeout": 0, 
          "retry": 0
        }
      ]
    },
    {
      "name": "build", // 编译阶段
      "timeout": 0, 
      "steps": [
        {
          "name": "build", // 编译
          "enable": true, 
          "package": "nidle-plugin-build", 
          "timeout": 0, 
          "retry": 0,
          "options": {
            "output": "dist",
            "buildShell": "release.sh"
          }
        },
        {
          "name": "imagemin", // 图片压缩
          "enable": true, 
          "package": "nidle-plugin-imagemin", 
          "timeout": 0, 
          "retry": 0
        }
      ]
    },
    {
      "name": "publish", // 部署阶段
      "timeout": 0, 
      "steps": [
        {
          "name": "scp", // 代码同步服务器
          "enable": true, 
          "package": "nidle-plugin-scp", 
          "timeout": 0, 
          "retry": 0,
          "options": {
            "decompress": true
          }
        },
        {
          "name": "merge-request", // merge request请求，触发CodeReview
          "enable": true, 
          "package": "nidle-plugin-merge", 
          "timeout": 0, 
          "retry": 0,
          "secure": true,
          "options": {
            "apiUrl": "",
            "privateToken": "",
            "targetBranch": "release",
            "codeReview": true,
            "autoMerge": false,
            "removeSourceBranch": false
          }
        }
      ]
    }
  ]
}
```

#### 生产环境
```javascript
{
  "name": "production-assets", 
  "mode": "production",
  "type": "publish", 
  "stages": [
    {
      "name": "publish", // 部署阶段
      "timeout": 0, 
      "steps": [
        {
          "name": "scp", // 代码同步服务器
          "enable": true, 
          "package": "nidle-plugin-scp", 
          "timeout": 0, 
          "retry": 0,
          "secure": true,
          "options": {
            "decompress": true
          }
        },
        {
          "name": "merge-request", // merge request请求，合并主干
          "enable": true, 
          "package": "nidle-plugin-merge", 
          "timeout": 0, 
          "retry": 0,
          "secure": true,
          "options": {
            "apiUrl": "",
            "privateToken": "",
            "sourceBranch": "release",
            "targetBranch": "master",
            "codeReview": false,
            "autoMerge": true,
            "removeSourceBranch": true
          }
        }
      ]
    }
  ]
}
```
