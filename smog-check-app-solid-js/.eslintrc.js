module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:solid/typescript'
    ],
    'overrides': [
        {
            'env': {
                'node': true
            },
            'files': [
                '.eslintrc.{js,cjs}'
            ],
            'parserOptions': {
                'sourceType': 'script'
            }
        }
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint',
        // solid
        'solid'
    ],
    'rules': {
        // force quotes to be single quotes '
        'quotes': [
            'error',
            'single'
        ],
        // force 4 space tabs
        'indent': [ 'error', 4, { 'SwitchCase': 1 } ],
        // force semicolon at the end of lines
        'semi': [ 'error', 'always' ],
        // forbid spaces after function name or async before parenthesis
        'space-before-function-paren': [ 'error', {
            'anonymous': 'never',
            'named': 'never',
            'asyncArrow': 'always'
        } ],
        // padding within blocks such as classes, functions, etc
        'padded-blocks': [ 'error', 'always' ],
        // adds spacing between curly braces like { this }
        'object-curly-spacing': [ 'error', 'always' ],
        // adds spacing between brackets like [ this ]
        'array-bracket-spacing': [ 'error', 'always' ],
        // adds spacing in properties for functions and objects like obj[ this ]
        'computed-property-spacing': [ 'error', 'always' ],


        // jsx
        'jsx-quotes': [ 'error', 'prefer-single' ]
    }
};
