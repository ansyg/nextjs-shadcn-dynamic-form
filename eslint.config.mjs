// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;


import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript-specific rules you want to adjust
      "@typescript-eslint/no-explicit-any": "off", // Disable 'any' warnings
      "@typescript-eslint/array-type": "off", // Disable array-type format warnings
      "@typescript-eslint/consistent-type-definitions": "off", // Allow both interface and type
      
      // Optional: Other rules you might want to tweak
      "@typescript-eslint/no-unused-vars": "warn", // Make unused vars warnings instead of errors
    }
  }
];

export default eslintConfig;