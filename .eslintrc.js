module.exports = {
  parser: "@typescript-eslint/parser", // 指定 ESLint 解析器
  extends: [
    "eslint:recommended", // 使用 ESLint 推荐规则
    "plugin:@typescript-eslint/eslint-recommended", // 使用 @typescript-eslint/eslint-plugin 推荐规则的一个子集
    "plugin:@typescript-eslint/recommended", // 使用 @typescript-eslint/eslint-plugin 推荐规则
    "plugin:prettier/recommended",
  ],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off", // 关闭对 any 类型的警告
    "@typescript-eslint/ban-types": "off",
    "no-console": [0],
    "@typescript-eslint/no-require-imports": [0],
    "prefer-spread": "off",
    // "prettier/prettier": [0],
  },
};
