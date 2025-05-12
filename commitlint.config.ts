import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "monorepo",
        "web",
        "cms",
        "api",
        "blue",
        "helpers",
        "ical-builder",
        "tsconfig",
      ],
    ],
  },
};

export default Configuration;
