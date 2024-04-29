module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  ignorePatterns: ['*.config.*', 'dist/*', 'build/*', 'public/*', 'src/apis/modules/**'],
  rules: {
    'no-console': process.env.NODE_ENV !== 'development' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV !== 'development' ? 'warn' : 'off',
    'semi': ['error', 'always'],
    quotes: ['error', 'single'],
    'no-param-reassign': ['error', { props: false }],
    'comma-dangle': 'off',
    'max-len': ['error', 3000],
    'lines-between-class-members': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-plusplus': 'off',
    'no-lonely-if': 'off',
    'prefer-template': 'off',
    'no-await-in-loop': 'off',
    'class-methods-use-this': 'off',
    'linebreak-style': [0, 'error', 'windows'],
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-absolute-path': 'off',
    'no-unused-expressions': 'off',
    'no-nested-ternary': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'object-curly-newline': ['off', {
      'ObjectPattern': { multiline: true, minProperties: 4 }
    }],
    'operator-linebreak': ['off', 'after'],
    'import/no-self-import': 0,
    'import/no-duplicates': 'off',
    'quote-props': 'off',
    'no-use-before-define': 0,
    'global-require': 0,
    'import/no-dynamic-require': 'off',
    'no-underscore-dangle': 'off',
    'import/no-extraneous-dependencies': 0,
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'off',
    'no-irregular-whitespace': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],
    'space-before-function-paren': 'off'
  },
  'globals': {
    'uap': 'readonly',
    'openVideo': 'readonly',
    'regist': 'readonly',
    'defineProps': 'readonly',
    'defineOptions': 'readonly',
    'defineEmits': 'readonly',
    'defineExpose': 'readonly',
  }
};
