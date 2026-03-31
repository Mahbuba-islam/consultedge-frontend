// import { defineConfig, globalIgnores } from "eslint/config";
// import nextVitals from "eslint-config-next/core-web-vitals";
// import nextTs from "eslint-config-next/typescript";

// const eslintConfig = defineConfig([
//   ...nextVitals,
//   ...nextTs,
//   // Override default ignores of eslint-config-next.
//   globalIgnores([
//     // Default ignores of eslint-config-next:
//     ".next/**",
//     "out/**",
//     "build/**",
//     "next-env.d.ts",
//   ]),
// ]);

// export default eslintConfig;



import { defineConfig } from "eslint/config"
import next from "eslint-config-next"
import query from "@tanstack/eslint-plugin-query"

export default defineConfig([
  {
    ignores: ["node_modules", ".next", "dist", "build"],
  },

  // Next.js + React rules
  ...next(),

  // TypeScript rules
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // TanStack Query plugin
  {
    plugins: {
      "@tanstack/query": query,
    },
    rules: {
      "@tanstack/query/stable-query-key": "error",
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/no-rest-destructuring": "warn",
    },
  },

  // React + JSX improvements
  {
    rules: {
      "react/jsx-no-useless-fragment": "warn",
      "react/no-unknown-property": "off",
    },
  },
])