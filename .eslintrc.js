module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	extends: 'eslint:recommended',
	// required to lint *.vue files
	plugins: [
		'html',
	],
	// check if imports actually resolve
	'settings': {
		'import/resolver': {
			'webpack': {
				'config': 'build/webpack.base.conf.js'
			}
		}
	},
	'env': {
		'es6': true
	},
	// add your custom rules here
	'rules': {
		'indent': ['error', 'tab', {'SwitchCase': 1}],
		'curly': 'error',
		'no-trailing-spaces': 'error',
		'brace-style': ['error', '1tbs'],
		'new-cap': ['error', {'newIsCap': true}],
		'new-parens': 'error',
		'no-eval': 'error',
		'require-jsdoc': ['warn', {
			'require': {
				"FunctionDeclaration": true,
				"MethodDefinition": true,
				"ClassDeclaration": true,
				"ArrowFunctionExpression": true
			}
		}],
		'no-var': 'warn',
		'prefer-const': 'warn',
		'valid-jsdoc': ['warn', {
			'requireReturn': false
		}],
		'no-console': 'off',
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
	}
};
