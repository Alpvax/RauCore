module.exports = {
  root: true,
  env: {
    node: true,
  },
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "indent": ["error", 2, { SwitchCase: 1 }],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "no-undef": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
    "multiline-ternary": ["error", "always-multiline"],
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    "curly": ["warn", "all"],
    "eol-last": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "max-len": ["error", { code: 100, tabWidth: 2, ignoreTrailingComments: true }],
    "no-trailing-spaces": ["error"],
    "object-curly-spacing": ["warn", "always", { objectsInObjects: false, arraysInObjects: false }],
    "arrow-parens": ["warn", "as-needed", { "requireForBlockBody": true }],
    "@typescript-eslint/array-type": ["error"],
    "@typescript-eslint/class-name-casing": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/member-delimiter-style": ["error", {
      multiline: { delimiter: "semi", requireLast: true },
      singleline: { delimiter: "semi", requireLast: false },
    }],
  },
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  plugins: [
    "@typescript-eslint"
  ],
  overrides: [
    {
      files: [
        "**/*.d.ts",
      ],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)"
      ],
      env: {
        mocha: true
      },
    },
  ]
}
