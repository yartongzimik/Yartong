import { NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      {
        status: "ok",
        service: "yartong-web",
        database: "reachable",
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  } catch {
    return NextResponse.json(
      {
        status: "error",
        service: "yartong-web",
        database: "unreachable",
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  }
}
