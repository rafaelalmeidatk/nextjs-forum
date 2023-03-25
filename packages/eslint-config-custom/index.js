module.exports = {
  extends: ['next', 'turbo', 'prettier'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-img-element': 'off',
    'turbo/no-undeclared-env-vars': [
      'error',
      {
        allowList: ['MIGRATE_OP'],
      },
    ],
  },
}
