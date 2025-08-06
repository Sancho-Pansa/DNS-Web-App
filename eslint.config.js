import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  // @ts-expect-error "It works anyway"
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  pluginVue.configs["flat/strongly-recommended"],
  stylistic.configs.customize({
    "indent": 2,
    "quotes": "double",
    "severity": "warn",
    "semi": true,
    "commaDangle": "only-multiline",
    "quoteProps": "consistent",
    "braceStyle": "1tbs"
  }),
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    plugins: {
      "@stylistic": stylistic
    },
    rules: {
      // ESLint-specific
      "@typescript-eslint/no-unused-vars": ["warn"],

      // ESLint-Stylistic-specific
      "@stylistic/space-before-function-paren": ["error", {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "always"
      }],
      "@stylistic/member-delimiter-style": ["warn", {
        "multiline": {
          "delimiter": "comma",
          "requireLast": false
        }
      }],

      // Vue-specific
      "vue/max-attributes-per-line": ["warn", {
        "singleline": {
          "max": 2
        }
      }],
      "vue/html-closing-bracket-newline": ["warn", {
        "multiline": "never",
        "selfClosingTag": { "multiline": "always" }
      }]
    }
  }
]);
