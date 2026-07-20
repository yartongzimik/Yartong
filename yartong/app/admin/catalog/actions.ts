"use server";

import { randomUUID } from "node:crypto";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { enforceMutationRateLimit } from "@/lib/rate-limit";

type ProductStatus = "ACTIVE" | "PENDING_REVIEW" | "MERGED" | "ARCHIVED";

type LockedProduct = {
  id: string;
  status: ProductStatus;
  name: string;
};

const allowedTransitions: Record<ProductStatus, ProductStatus[]> = {
  ACTIVE: ["PENDING_REVIEW", "ARCHIVED"],
  PENDING_REVIEW: ["ACTIVE", "ARCHIVED"],
  ARCHIVED: ["PENDING_REVIEW"],
  MERGED: [],
};

function actionForTransition(current: ProductStatus, next: ProductStatus) {
  if (current === "PENDING_REVIEW" && next === "ACTIVE") return "APPROVE";
  if (next === "ARCHIVED") return "ARCHIVE";
  if (current === "ARCHIVED" && next === "PENDING_REVIEW") return "RESTORE_TO_REVIEW";
  return "SEND_TO_REVIEW";
}

export async function moderateCatalogProductAction(
  productId: string,
  nextStatus: ProductStatus,
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");
  await enforceMutationRateLimit({ actorId: admin.id, action: "admin-catalog-moderate", limit: 60, windowSeconds: 3600 });

  if (!["ACTIVE", "PENDING_REVIEW", "ARCHIVED"].includes(nextStatus)) {
    throw new Error("Unsupported catalog moderation status.");
  }

  const note = String(formData.get("note") ?? "").trim();
  if (note.length > 1000) throw new Error("Moderation note is too long.");

  await prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<LockedProduct[]>(Prisma.sql`
      SELECT "id", "name", "status"::text AS "status"
      FROM "CatalogProduct"
      WHERE "id" = ${productId}
      FOR UPDATE
    `);
    const product = rows[0];
    if (!product) throw new Error("Catalog product not found.");
    if (!allowedTransitions[product.status].includes(nextStatus)) {
      throw new Error(`Invalid catalog transition from ${product.status} to ${nextStatus}.`);
    }

    await tx.$executeRaw(Prisma.sql`
      UPDATE "CatalogProduct"
      SET "status" = ${nextStatus}::"CatalogProductStatus", "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${product.id}
    `);

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "CatalogModerationEvent" ("id", "productId", "actorId", "action", "note")
      VALUES (${randomUUID()}, ${product.id}, ${admin.id}, ${actionForTransition(product.status, nextStatus)}, ${note || null})
    `);
  });

  revalidatePath("/admin/catalog");
  revalidatePath("/materials");
}

export async function mergeCatalogProductAction(sourceProductId: string, formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  await enforceMutationRateLimit({ actorId: admin.id, action: "admin-catalog-merge", limit: 20, windowSeconds: 3600 });

  const targetProductId = String(formData.get("targetProductId") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  if (!targetProductId) throw new Error("Choose a canonical target product.");
  if (targetProductId === sourceProductId) throw new Error("A product cannot be merged into itself.");
  if (!note) throw new Error("A merge note is required for the audit trail.");
  if (note.length > 1000) throw new Error("Merge note is too long.");

  await prisma.$transaction(async (tx) => {
    const products = await tx.$queryRaw<LockedProduct[]>(Prisma.sql`
      SELECT "id", "name", "status"::text AS "status"
      FROM "CatalogProduct"
      WHERE "id" IN (${sourceProductId}, ${targetProductId})
      ORDER BY "id"
      FOR UPDATE
    `);
    const source = products.find((product) => product.id === sourceProductId);
    const target = products.find((product) => product.id === targetProductId);
    if (!source || !target) throw new Error("Source or target catalog product no longer exists.");
    if (!["ACTIVE", "PENDING_REVIEW"].includes(source.status)) throw new Error("Only active or review-pending products can be merged.");
    if (target.status !== "ACTIVE") throw new Error("The canonical merge target must be active.");

    await tx.$executeRaw(Prisma.sql`
      UPDATE "CatalogVariant"
      SET "productId" = ${target.id}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "productId" = ${source.id}
    `);

    await tx.$executeRaw(Prisma.sql`
      UPDATE "CatalogProduct"
      SET "status" = 'MERGED'::"CatalogProductStatus", "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${source.id}
    `);

    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "CatalogModerationEvent" ("id", "productId", "targetProductId", "actorId", "action", "note", "metadata")
      VALUES (
        ${randomUUID()},
        ${source.id},
        ${target.id},
        ${admin.id},
        'MERGE',
        ${note},
        ${JSON.stringify({ sourceName: source.name, targetName: target.name })}::jsonb
      )
    `);
  });

  revalidatePath("/admin/catalog");
  revalidatePath("/materials");
}
