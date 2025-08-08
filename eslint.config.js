const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettierPlugin = require("eslint-plugin-prettier");
const importPlugin = require("eslint-plugin-import");
const prettierConfig = require("eslint-config-prettier");
const airBnbBase = require("eslint-config-airbnb-base");

module.exports = [
  {
    files: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      ...airBnbBase.rules,
      "@typescript-eslint/ban-ts-comment": "off",
      "max-classes-per-file": "off",
      "prefer-destructuring": "off",
      "import/no-extraneous-dependencies": "off",
      "import/prefer-default-export": "off",
      "class-methods-use-this": "off",
      camelcase: "off",
      "no-shadow": "off",
      "no-useless-constructor": "off",
      "no-plusplus": "off",
      "no-underscore-dangle": "off",
      "@typescript-eslint/ban-types": "off",
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "_",
        },
      ],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
        },
      ],
    },
    settings: {
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },
];
