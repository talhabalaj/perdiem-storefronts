// Vite+ owns lint (Oxlint), format (Oxfmt) and tests (Vitest). Next.js owns dev/build.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

const DB_LAYER_ONLY = {
  paths: [
    { name: "better-sqlite3", message: "Only src/db and src/lib/repo talk to SQLite." },
    { name: "drizzle-orm", message: "Only src/db and src/lib/repo use Drizzle." },
  ],
  patterns: [{ group: ["@/db", "@/db/*"], message: "Go through the StoreRepository instead." }],
};

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },

  fmt: {
    ignorePatterns: [".next/**", "drizzle/**", "playwright-report/**", "test-results/**"],
  },

  lint: {
    ignorePatterns: [".next/**", "drizzle/**", "next-env.d.ts"],
    plugins: ["typescript", "unicorn", "oxc", "react", "nextjs", "import", "jsx-a11y"],
    jsPlugins: ["./lint/slop-plugin.ts"],
    categories: { correctness: "error", suspicious: "error", perf: "warn" },
    options: { typeAware: true, typeCheck: true },
    rules: {
      // Slop: project rules (see lint/slop-plugin.ts)
      "slop/no-manual-memo": "error",
      "slop/no-fetch-in-effect": "error",
      "slop/no-slop-comments": "error",
      "slop/no-hardcoded-color": "error",

      // Slop: type escape hatches
      "typescript/no-explicit-any": "error",
      "typescript/no-non-null-assertion": "error",
      "typescript/ban-ts-comment": "error",
      "typescript/no-unsafe-type-assertion": "error",
      "typescript/no-unsafe-argument": "error",
      "typescript/no-unsafe-assignment": "error",
      "typescript/no-unsafe-member-access": "error",
      "typescript/no-unsafe-call": "error",
      "typescript/no-unsafe-return": "error",
      "typescript/no-unnecessary-type-assertion": "error",
      "typescript/consistent-type-imports": "error",

      // Slop: async mistakes
      "typescript/no-floating-promises": "error",
      "typescript/no-misused-promises": "error",
      "typescript/require-await": "error",
      "typescript/switch-exhaustiveness-check": "error",
      "typescript/no-unnecessary-condition": "error",
      "typescript/prefer-nullish-coalescing": "error",
      "typescript/restrict-template-expressions": "error",
      "typescript/no-deprecated": "warn",

      // Slop: dead / defensive / noisy code
      "eslint/no-unused-vars": "error",
      "eslint/no-console": ["error", { allow: ["error", "warn"] }],
      "eslint/no-warning-comments": ["error", { terms: ["todo", "fixme", "xxx", "hack"] }],
      "eslint/no-useless-catch": "error",
      "eslint/no-useless-return": "error",
      "eslint/no-empty-function": "error",
      "eslint/no-else-return": "error",
      "eslint/no-lonely-if": "error",
      "eslint/eqeqeq": "error",
      "eslint/no-param-reassign": "error",
      "eslint/no-shadow": "error",
      "react/jsx-no-useless-fragment": "error",

      // Slop: oversized, tangled code
      "eslint/max-lines": ["error", { max: 250, skipBlankLines: true, skipComments: true }],
      "eslint/max-lines-per-function": [
        "error",
        { max: 80, skipBlankLines: true, skipComments: true },
      ],
      "eslint/complexity": ["error", 12],
      "eslint/max-depth": ["error", 3],
      "eslint/max-params": ["error", 3],
      "eslint/no-nested-ternary": "error",
      "oxc/no-barrel-file": "error",
      "import/no-cycle": "error",
      "import/no-self-import": "error",
      "import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],

      // React / Next correctness
      "react/rules-of-hooks": "error",
      "react/exhaustive-deps": "error",
      "react/jsx-key": "error",
      "react/no-array-index-key": "error",
      "react/button-has-type": "error",
      "react/no-danger": "error",
      "react/react-in-jsx-scope": "off",
      "nextjs/no-img-element": "error",
      "nextjs/no-html-link-for-pages": "error",
    },
    overrides: [
      {
        // UI and routes never touch the database directly.
        files: ["src/app/**", "src/components/**", "src/hooks/**"],
        rules: { "eslint/no-restricted-imports": ["error", DB_LAYER_ONLY] },
      },
      {
        // Seed data and theme schemas legitimately contain brand colors.
        files: ["src/db/seed/**", "src/lib/theme/**", "tests/**", "e2e/**"],
        rules: { "slop/no-hardcoded-color": "off" },
      },
      {
        files: ["tests/**", "e2e/**", "**/*.test.ts", "**/*.test.tsx"],
        rules: {
          "eslint/max-lines-per-function": "off",
          "eslint/max-lines": "off",
          "typescript/no-non-null-assertion": "off",
          "eslint/max-params": "off",
        },
      },
      {
        // Seed scripts and migrations run from the CLI.
        files: ["src/db/**", "scripts/**"],
        rules: { "eslint/no-console": "off" },
      },
    ],
  },

  test: {
    include: ["tests/unit/**/*.test.ts", "src/**/*.test.ts"],
    environment: "node",
  },

  staged: {
    "*.{ts,tsx,js,mjs}": "vp check --fix",
  },
});
