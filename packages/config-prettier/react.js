/**
 * A custom Prettier configuration for libraries that use Next.js.
 *
 * @type {import("prettier").Config}
 * */
const config = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
