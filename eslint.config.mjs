import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  jsonc: true,
  typescript: true,
  ignores: ['./index.js'],
}, {
  rules: {
    'antfu/consistent-list-newline': 'off',
    'ts/consistent-type-definitions': ['error', 'type'],
  },
})
