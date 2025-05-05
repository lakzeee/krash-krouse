const config = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss', '@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@/utils/(.*)$',
    '^@/services/(.*)$',
    '^@/graphql/(.*)$',
    '^@/components/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
};

export default config;
