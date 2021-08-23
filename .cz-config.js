module.exports = {
  types: [
    { value: 'feat', name: 'feat:       新功能' },
    { value: 'fix', name: 'fix:        bug 修复' },
    { value: 'docs', name: 'docs:       文档更新' },
    { value: 'chore', name: 'chore:      对构建过程或辅助工具和库（如文档生成）的更改' },
    { value: 'init', name: 'init:       初始提交' },
    { value: 'style', name: 'style:      修改格式（空格，格式化，省略分号等），对代码运行没有影响' },
    { value: 'refactor', name: 'refactor:   代码重构' },
    { value: 'perf', name: 'perf:       性能优化' },
    { value: 'test', name: 'test:       添加测试' },
    { value: 'revert', name: 'revert:     撤销某个 commit' },
  ],
  scopes: [],
  // override the messages, defaults are as follows
  messages: {
    type: "选择需要提交的更改类型 (type):",
    scope: '更改的范围 (scope) (可选):',
    customScope: '自定义更改的范围 (customScope) (可选):',
    subject: '对这次提交填写一个简短准确的描述 (subject):',
    confirmCommit: '确认提交?',
  },
  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  skipQuestions: ['body', 'footer'],
  // limit subject length
  subjectLimit: 100
};