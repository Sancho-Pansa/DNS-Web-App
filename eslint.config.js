import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    languageOptions: { globals: {...globals.browser, ...globals.node} }
  },
  // @ts-expect-error "It works anyway"
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    plugins: {
      "@stylistic": stylistic
    },
    rules: {
      // ESLint-specific
      "@typescript-eslint/no-unused-vars": ["warn"],

      // ESLint-Stylistic
      "space-before-function-paren": ["error", {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "always"
      }]
    }
  }
]);
