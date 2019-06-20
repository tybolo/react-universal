module.exports = {
  root: true,   // 阻止eslint继续向父级目录查找eslint配置文件
  env: {
    node: true,
    es6: true,  // 开启es6运行环境
  },
  // parser: 'babel-eslint',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      'version': 'detect', // React version
    }
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {
    TARGET_ENV: false,
    NODE_ENV: false
  },
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'react/display-name': 'off'
  }
}
