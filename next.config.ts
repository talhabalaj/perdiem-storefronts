import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Docker image runs the self-contained server; local `next start` keeps the default.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  cacheComponents: true,
  devIndicators: false,
  partialPrefetching: true,
  // Compiler owns memoization; manual useMemo/useCallback/memo are banned by lint.
  reactCompiler: {
    environment: { enablePreserveExistingMemoizationGuarantees: false },
  },
  experimental: {
    // Native Rust port of the React Compiler inside Turbopack (no Babel plugin).
    turbopackRustReactCompiler: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
