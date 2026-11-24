import { config } from "@remotion/eslint-config-flat";

export default [
  ...config,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/out/**",
      "**/public/**",
      "**/scripts/**",
    ],
  },
];
