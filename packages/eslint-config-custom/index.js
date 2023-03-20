module.exports = {
  extends: ['next', 'turbo', 'prettier'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'turbo/no-undeclared-env-vars': [
      'error',
      {
        allowList: ['MIGRATE_OP'],
      },
    ],
  },
}
