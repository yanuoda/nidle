module.exports = {
  extents: ['cz'],
  rules: {
		'header-max-length': [2, 'always', 100],
		'subject-empty': [2, 'never'],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
		'type-enum': [
			2,
			'always',
			[
				'init',
				'chore',
				'docs',
				'feat',
				'fix',
				'perf',
				'refactor',
				'revert',
				'style',
				'test',
			],
		],
  },
}
