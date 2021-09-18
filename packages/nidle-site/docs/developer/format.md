---
id: format
title: 代码规范及语法检查
sidebar_position: 7
---

### Eslint
可组装的JavaScript和JSX检查工具。
#### 安装依赖
```
yarn add -D -W eslint  //安装eslint
yarn add -D -W eslint-plugin-react eslint-plugin-node //安装相关插件
```
#### 初始化
```
eslint./node_modules/.bin/eslint --init  //初始化
```

#### 配置相关
基本配置项可查阅Eslint官网的 [Configuring ESLint](https://cn.eslint.org/docs/user-guide/configuring)
### Prettier
一个“有态度”的代码格式化工具。
#### 安装依赖
```
yarn add -D -W prettier eslint-config-prettier eslint-plugin-prettier //安装prettier及相关
```
#### 基本操作
安装后，执行 ```npx prettier --help```
```
$ npx prettier app.js               # 检查单个文件，问题文件内容会被输出到console中
$ npx prettier app/**/.js           # 检查多个文件
$ npx prettier app/**/.js -l        # 检查多个文件，问题文件的path会被输出到console中
$ npx prettier app/**/.js --write   # 检查多个文件，自动修复问题文件
```
#### 配置相关
+ .prettierrc 配置文件，各种规则配置项参考这里。
+ .prettierignore 类似于.gitignore
#### 配合
ESLint 和 Prettier 为什么需要配合使用：
+ ESLint 推出 --fix 参数前，ESLint 并没有自动格式化代码的功能，而 Prettier 可以自动格式化代码。
+ 部分虽然 ESLint 也可以校验代码格式，但 Prettier 更擅长。

#### eslint-config-prettier
ESLint 与格式化相关的 rule 和 prettier 的 rule 有些重叠，如果想把格式化相关的事情都交给 prettier 去做，使用这个工具可以屏蔽掉 ESLint 与格式化相关的 rule。
```
// .eslintrc -> eslint-plugin-prettier
{
plugins: ["prettier"],  // 在eslint时启动prettier检查
rules: {
    "prettier/prettier": "error"  // prettier的lint的冲突会被ESLint当做错误处理
}}
```

#### eslint-plugin-prettier
eslint-plugin-prettier 是 Prettier 为 ESLint 开发的插件，使用它，可以在 eslint 中起到 prettier 检查。
```  
 // .eslintrc -> eslint-config-prettier
 {
    extends: [''plugin:prettier/recommended'],
}
```
### 提交检验

如果，我们想要使用 git 提交代码时，通过 prettier 来优化代码，还需要借助一些工具来完成。
+ husky：一个方便用来处理 pre-commit 、 pre-push 等 githooks 的工具
+ lint-staged：对 git 暂存区的代码，运行 linters 的工具

#### 安装依赖
```
yarn add -D -W lint-staged husky 
npx husky add .husky/pre-commit "yarn lint-staged" 
```
#### 配置相关
```
// package.json
{
  ...
  "scripts": {
    "prepare": "husky install",
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.{js,jsx,mjs,ts,tsx}": [
      "prettier --write",
      "eslint"
    ],
    "*.{css,scss,less,json,html,md,markdown}": [
      "prettier --write",
      "git add"
    ]
  }
  ...
}
```
### EditorConfig
因为并不是所有的人都使用VS code，所以为了在同样的项目下保持一致，比如tab的宽度或者行尾要不要有分号，我们可以定制.editorconfig来统一这些配置。

下面是模板配置里面用到的.editorconfig的配置

```
# top-most EditorConfig file
root = true
# 设置文件编码为 UTF-8
# 用两个空格代替制表符
# 在保存时删除尾部的空白字符
# 在文件结尾添加一个空白行
[*]
indent_style = space
indent_size = 2
end_of_line = crlf
charset = utf-8
trim_trailing_whitespace = false
insert_final_newline = false
    
# 设为true表示会去除换行行首的任意空白字符
[*.md]
trim_trailing_whitespace = false
```

### 补充
使用prettier后，项目里部分规则与原日常开发时存在出入的情况，收集出如下一些规则：

*  **Replace ↹ with ··** 关于使用tab or 空格以及vs code的问题，参考[
在tab处理这件事上, 只能说vscode真傻](http://gwiki.cn/2019/04/%E5%9C%A8tab%E5%A4%84%E7%90%86%E8%BF%99%E4%BB%B6%E4%BA%8B%E4%B8%8A,-%E5%8F%AA%E8%83%BD%E8%AF%B4vscode%E7%9C%9F%E5%82%BB)
*  **Expected to call 'super()' 和  'import()' expressions are not supported yet** 参考[
Verify calls of super() in constructors (constructor-super)](https://eslint.org/docs/rules/constructor-super)，禁用相关规则 -> 'node/no-unsupported-features/es-syntax': [2, { ignores: ['modules', 'dynamicImport'] }]
*  **Delete ' '** 使用prettier代替eslint做格式检查后，因为prettier没有对应的配置项故报错，目前的解决方案为：
    *   添加eslint规则，让eslint妥协prettier -> 'space-before-function-paren': 'off'
    *   关闭eslint的prettier插件

    

### 参考文献
+  [官方文档](https://cn.eslint.org/docs/user-guide/configuring)
+  [使用 ESLint、Prettier 优化代码](https://zhangbuhuai.com/post/eslint-prettier.html)
+  [从0到1配置eslint](https://note.youdao.com/ynoteshare/index.html?id=d0ac668ce8a55efae908aba7cbc93cfb&type=note&_time=1631158021993#/)
+  [最全的Eslint配置模板，从此统一团队的编程习惯](https://juejin.cn/post/6844903859488292871#heading-15)