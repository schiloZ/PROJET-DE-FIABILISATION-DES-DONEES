import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Disable react/no-unescaped-entities to allow unescaped quotes in JSX
      "react/no-unescaped-entities": "off",
      // Disable react-hooks/exhaustive-deps to ignore missing dependencies warning
      "react-hooks/exhaustive-deps": "off",
      // Disable react-hooks/rules-of-hooks to allow hooks in non-standard function names (temporary fix)
      "react-hooks/rules-of-hooks": "off",
    },
  },
];

export default eslintConfig;
