import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type AvailableCatalogVariant = {
  variantId: string;
  productName: string;
  variantName: string;
  categoryName: string;
  brandName: string | null;
  unitName: string;
  unitQuantity: string;
  gtin: string | null;
};

export async function getAvailableCatalogVariantsForSupplier(supplierId: string) {
  return prisma.$queryRaw<AvailableCatalogVariant[]>(Prisma.sql`
    SELECT v."id" AS "variantId", p."name" AS "productName", v."name" AS "variantName",
      c."name" AS "categoryName", b."name" AS "brandName", v."unitName",
      v."unitQuantity"::text AS "unitQuantity", v."gtin"
    FROM "CatalogVariant" v
    JOIN "CatalogProduct" p ON p."id" = v."productId"
    JOIN "CatalogCategory" c ON c."id" = p."categoryId"
    LEFT JOIN "CatalogBrand" b ON b."id" = p."brandId"
    WHERE v."status" = 'ACTIVE'::"CatalogVariantStatus"
      AND p."status" = 'ACTIVE'::"CatalogProductStatus"
      AND NOT EXISTS (
        SELECT 1 FROM "SupplierListing" l
        WHERE l."supplierId" = ${supplierId} AND l."variantId" = v."id"
      )
    ORDER BY p."name" ASC, v."name" ASC
    LIMIT 500
  `);
}
