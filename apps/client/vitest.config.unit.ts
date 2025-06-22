// vitest.config.unit.ts
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    coverage: {
      provider: "v8",
      enabled: true,
      exclude: [
        "**/*.config.ts",
        "**/*.config.mjs",
        "**/*.config.js",
        "prisma/generated/**",
        "**/zod.ts",
        "**/prisma.ts",
        "components/ui/**",
        "**/index.ts",
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
  resolve: {
    alias: {
      "@/app": "/app",
      "@/lib": "/lib",
      "@/prisma": "/prisma",
      "@/services": "/services",
      "@/store": "/store",
      "@/types": "/types",
      "@/utils": "/utils",
    },
  },
});
