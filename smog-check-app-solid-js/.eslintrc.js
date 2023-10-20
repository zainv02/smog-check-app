/**
 * Various notes:
 * eslint rule priorities
 * https://github.com/eslint/eslint/discussions/15704
 * 
 * 
 */

module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        // eslint-plugin-import https://github.com/import-js/eslint-plugin-import/tree/main
        // 'plugin:import/recommended', // this doesn't seem to be able to resolve internals
        // eslint-import-resolver-typescript
        'plugin:import/typescript',
        // eslint-plugin-tailwindcss
        'plugin:tailwindcss/recommended',
        // solid
        'plugin:solid/typescript',
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
        // eslint-plugin-import
        'import',
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

        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_',
            }
        ],

        // jsx
        'jsx-quotes': [ 'error', 'prefer-single' ],

        // eslint-plugin-import
        // 'import/extensions': [ 'error', 'never' ], // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md
        'import/order': [ 
            'warn', 
            { 
                // 'groups': [ 
                //     'builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type' 
                // ],
                'alphabetize': {
                    'order': 'asc', /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */
                    'caseInsensitive': true /* ignore case. Options: [true, false] */
                },
                'pathGroupsExcludedImportTypes': [],
                'newlines-between': 'always' 
            }
        ]
    },

    // https://github.com/import-js/eslint-import-resolver-typescript
    'settings': {
        'import/parsers': {
            '@typescript-eslint/parser': [ '.ts', '.tsx' ]
        },
        'import/resolver': {
            'typescript': {
                'alwaysTryTypes': true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
            },
            // 'node': true
        }
    }
};
