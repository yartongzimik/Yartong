CREATE TABLE "MaterialPaymentOrder" (
  "id" TEXT NOT NULL,
  "materialOrderId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
  "idempotencyKey" TEXT NOT NULL,
  "providerName" TEXT,
  "providerPaymentRef" TEXT,
  "failureCode" TEXT,
  "failureMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "cancelledAt" TIMESTAMP(3),
  CONSTRAINT "MaterialPaymentOrder_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MaterialPaymentOrder_materialOrderId_fkey" FOREIGN KEY ("materialOrderId") REFERENCES "MaterialOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "MaterialPaymentOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "MaterialPaymentOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "MaterialPaymentOrder_amount_check" CHECK ("amount" > 0)
);

CREATE UNIQUE INDEX "MaterialPaymentOrder_materialOrderId_key" ON "MaterialPaymentOrder"("materialOrderId");
CREATE UNIQUE INDEX "MaterialPaymentOrder_idempotencyKey_key" ON "MaterialPaymentOrder"("idempotencyKey");
CREATE INDEX "MaterialPaymentOrder_customerId_status_idx" ON "MaterialPaymentOrder"("customerId", "status");
CREATE INDEX "MaterialPaymentOrder_supplierId_status_idx" ON "MaterialPaymentOrder"("supplierId", "status");
