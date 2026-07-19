import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Integration tests that exercise a live Postgres (local Supabase). Run via
 * `pnpm test:db` after `supabase start`. Kept out of the default unit run so
 * the main CI job stays fast and DB-free.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.integration.test.ts"],
    // No jsdom / global setup — these talk to Postgres, not the DOM.
    testTimeout: 20000,
    hookTimeout: 30000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
