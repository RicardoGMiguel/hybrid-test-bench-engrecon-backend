/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig } */
module.exports = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
  ],
  singleQuote: true,
  trailingComma: "all",
  arrowParens: "avoid",
  semi: true,
  printWidth: 140,
  importOrder: [
    "<TYPES>",
    "<THIRD_PARTY_MODULES>",
    "",
    "<TYPES>^@acme",
    "^@modules/(.*)$",
    "^@shared/(.*)$",
    "^@config/(.*)$",
    "^@constants/(.*)$",
    "",
    "<TYPES>^[.|..|~]",
    "^~/",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
};

