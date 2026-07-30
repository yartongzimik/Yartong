import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const vercelEnv = process.env.VERCEL_ENV?.trim().toLowerCase();
const shouldDeployMigrations = vercelEnv === "production" || process.env.FORCE_MIGRATE_DEPLOY === "true";

if (shouldDeployMigrations) {
  console.log(`[build] Running Prisma migrations for ${vercelEnv || "non-Vercel"} deployment.`);
  run("npx", ["prisma", "migrate", "deploy"]);
} else {
  console.log(`[build] Skipping prisma migrate deploy for ${vercelEnv || "local/CI"} build to avoid preview advisory-lock contention.`);
}

run("npx", ["prisma", "generate"]);
run("npx", ["next", "build"]);
