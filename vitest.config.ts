/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import "dotenv/config";
import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  test: {
    include: [
      "src/**/*.test.ts",
      "src/**/*.spec.ts",
      "tests/**/*.test.ts",
      "tests/**/*.spec.ts",
    ],
    environment: "node",
    globals: true,
    // setupFiles: ['tests/setup.ts'],
    passWithNoTests: true,
    testTimeout: 120 * 1000,
    printConsoleTrace: true,
  },
  plugins: [
    tsConfigPaths({
      projects: ["tsconfig.json"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@agents": path.resolve(__dirname, "./src/agents"),
      "@tasks": path.resolve(__dirname, "./src/tasks"),
      "@workspaces": path.resolve(__dirname, "./src/workspaces"),
      "@ui": path.resolve(__dirname, "./src/ui"),
      "@runtime": path.resolve(__dirname, "./src/runtime"),
    },
  },
});
