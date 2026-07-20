import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type CatalogModerationSummary = {
  active: number;
  pendingReview: number;
  archived: number;
  merged: number;
  supplierSubmitted: number;
  duplicateGroups: number;
};

export type CatalogModerationProduct = {
  id: string;
  slug: string;
  name: string;
  status: "ACTIVE" | "PENDING_REVIEW" | "MERGED" | "ARCHIVED";
  source: "ADMIN_CURATED" | "SUPPLIER_SUBMITTED" | "IMPORTED";
  categoryName: string;
  brandName: string | null;
  supplierName: string | null;
  variantCount: number;
  listingCount: number;
  createdAt: Date;
};

export type CatalogDuplicateCandidate = {
  leftId: string;
  leftName: string;
  leftStatus: string;
  rightId: string;
  rightName: string;
  rightStatus: string;
};

export async function getCatalogModerationSummary(): Promise<CatalogModerationSummary> {
  const rows = await prisma.$queryRaw<Array<{
    active: bigint;
    pendingReview: bigint;
    archived: bigint;
    merged: bigint;
    supplierSubmitted: bigint;
    duplicateGroups: bigint;
  }>>(Prisma.sql`
    SELECT
      COUNT(*) FILTER (WHERE p."status" = 'ACTIVE'::"CatalogProductStatus") AS "active",
      COUNT(*) FILTER (WHERE p."status" = 'PENDING_REVIEW'::"CatalogProductStatus") AS "pendingReview",
      COUNT(*) FILTER (WHERE p."status" = 'ARCHIVED'::"CatalogProductStatus") AS "archived",
      COUNT(*) FILTER (WHERE p."status" = 'MERGED'::"CatalogProductStatus") AS "merged",
      COUNT(*) FILTER (WHERE p."source" = 'SUPPLIER_SUBMITTED'::"CatalogProductSource") AS "supplierSubmitted",
      (
        SELECT COUNT(*)
        FROM (
          SELECT regexp_replace(lower("name"), '[^a-z0-9]+', '', 'g') AS normalized_name
          FROM "CatalogProduct"
          WHERE "status" IN ('ACTIVE'::"CatalogProductStatus", 'PENDING_REVIEW'::"CatalogProductStatus")
          GROUP BY normalized_name
          HAVING COUNT(*) > 1
        ) duplicate_groups
      ) AS "duplicateGroups"
    FROM "CatalogProduct" p
  `);

  const row = rows[0];
  return {
    active: Number(row?.active ?? 0),
    pendingReview: Number(row?.pendingReview ?? 0),
    archived: Number(row?.archived ?? 0),
    merged: Number(row?.merged ?? 0),
    supplierSubmitted: Number(row?.supplierSubmitted ?? 0),
    duplicateGroups: Number(row?.duplicateGroups ?? 0),
  };
}

export async function listCatalogModerationProducts(): Promise<CatalogModerationProduct[]> {
  const rows = await prisma.$queryRaw<Array<Omit<CatalogModerationProduct, "variantCount" | "listingCount"> & {
    variantCount: bigint;
    listingCount: bigint;
  }>>(Prisma.sql`
    SELECT
      p."id",
      p."slug",
      p."name",
      p."status"::text AS "status",
      p."source"::text AS "source",
      c."name" AS "categoryName",
      b."name" AS "brandName",
      creator."displayName" AS "supplierName",
      COUNT(DISTINCT v."id") AS "variantCount",
      COUNT(DISTINCT l."id") AS "listingCount",
      p."createdAt"
    FROM "CatalogProduct" p
    JOIN "CatalogCategory" c ON c."id" = p."categoryId"
    LEFT JOIN "CatalogBrand" b ON b."id" = p."brandId"
    LEFT JOIN "User" creator ON creator."id" = p."createdBySupplierId"
    LEFT JOIN "CatalogVariant" v ON v."productId" = p."id"
    LEFT JOIN "SupplierListing" l ON l."variantId" = v."id"
    WHERE p."status" <> 'MERGED'::"CatalogProductStatus"
    GROUP BY p."id", c."name", b."name", creator."displayName"
    ORDER BY
      CASE p."status" WHEN 'PENDING_REVIEW'::"CatalogProductStatus" THEN 0 WHEN 'ACTIVE'::"CatalogProductStatus" THEN 1 ELSE 2 END,
      p."updatedAt" DESC
    LIMIT 150
  `);

  return rows.map((row) => ({
    ...row,
    variantCount: Number(row.variantCount),
    listingCount: Number(row.listingCount),
  }));
}

export async function listCatalogDuplicateCandidates(): Promise<CatalogDuplicateCandidate[]> {
  return prisma.$queryRaw<CatalogDuplicateCandidate[]>(Prisma.sql`
    SELECT
      a."id" AS "leftId",
      a."name" AS "leftName",
      a."status"::text AS "leftStatus",
      b."id" AS "rightId",
      b."name" AS "rightName",
      b."status"::text AS "rightStatus"
    FROM "CatalogProduct" a
    JOIN "CatalogProduct" b
      ON a."id" < b."id"
      AND regexp_replace(lower(a."name"), '[^a-z0-9]+', '', 'g') = regexp_replace(lower(b."name"), '[^a-z0-9]+', '', 'g')
    WHERE a."status" IN ('ACTIVE'::"CatalogProductStatus", 'PENDING_REVIEW'::"CatalogProductStatus")
      AND b."status" IN ('ACTIVE'::"CatalogProductStatus", 'PENDING_REVIEW'::"CatalogProductStatus")
    ORDER BY a."name" ASC
    LIMIT 50
  `);
}
