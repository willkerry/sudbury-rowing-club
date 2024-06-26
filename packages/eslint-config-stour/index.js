/** @type {import("@types/eslint".ESLint.ConfigData)} */
module.exports = {
  plugins: ["sonarjs", "react-hooks", "sort-keys-fix"],
  extends: [
    "plugin:sonarjs/recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "next/core-web-vitals",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  globals: {
    React: true,
    JSX: true,
  },
  rules: {
    "react/require-default-props": 0,
    "react/no-unused-prop-types": 0,
    "sort-keys-fix/sort-keys-fix": 0, // switch on in order to enable auto-sort of keys
    "react/react-in-jsx-scope": 0,
    "jsx-a11y/anchor-is-valid": 0,

    /* These two try to enforce something that’s crucial, but they somehow nearly
     * always flag errors in compliant code. */
    "jsx-a11y/control-has-associated-label": 0,
    "jsx-a11y/label-has-associated-control": 0,

    "import/extensions": 0,
    "import/no-unresolved": 1,
    "react/jsx-filename-extension": [
      "error",
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "react/function-component-definition": 0,
    "no-underscore-dangle": 0,
    "react/jsx-props-no-spreading": 0,
    "no-use-before-define": ["error", { functions: false, classes: false }],
    "import/no-cycle": 0,
    "@next/next/no-img-element": 0,
    "@typescript-eslint/no-shadow": 0,
    "no-console": 0,
    "no-irregular-whitespace": 0,
    "import/prefer-default-export": 0,
  },
};
