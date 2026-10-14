import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.tsx"],
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,
    },
  },
  {
    // Module boundaries: other code may import a module only through its public index.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/*/*", "!@/modules/*/index"],
              message: "Import modules through their public API: '@/modules/<name>'.",
            },
          ],
        },
      ],
    },
  },
  {
    // Inside a module, its own files may import each other; db schema is shared infra.
    files: ["src/modules/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": "off" },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
];

export default config;
