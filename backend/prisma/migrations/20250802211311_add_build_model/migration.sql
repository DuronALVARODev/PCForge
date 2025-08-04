-- CreateTable
CREATE TABLE "Build" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "cpuId" TEXT,
    "gpuId" TEXT,
    "ramId" TEXT,
    "motherboardId" TEXT,
    "psuId" TEXT,
    "caseId" TEXT,
    "storageId" TEXT,
    "coolerId" TEXT,
    "extra" JSONB,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Build_userId_idx" ON "Build"("userId");

-- CreateIndex
CREATE INDEX "Build_cpuId_idx" ON "Build"("cpuId");

-- CreateIndex
CREATE INDEX "Build_gpuId_idx" ON "Build"("gpuId");

-- CreateIndex
CREATE INDEX "Build_ramId_idx" ON "Build"("ramId");

-- CreateIndex
CREATE INDEX "Build_motherboardId_idx" ON "Build"("motherboardId");

-- CreateIndex
CREATE INDEX "Build_psuId_idx" ON "Build"("psuId");

-- CreateIndex
CREATE INDEX "Build_caseId_idx" ON "Build"("caseId");

-- CreateIndex
CREATE INDEX "Build_storageId_idx" ON "Build"("storageId");

-- CreateIndex
CREATE INDEX "Build_coolerId_idx" ON "Build"("coolerId");

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_cpuId_fkey" FOREIGN KEY ("cpuId") REFERENCES "cpus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_gpuId_fkey" FOREIGN KEY ("gpuId") REFERENCES "gpus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_ramId_fkey" FOREIGN KEY ("ramId") REFERENCES "ram_modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_motherboardId_fkey" FOREIGN KEY ("motherboardId") REFERENCES "motherboards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_psuId_fkey" FOREIGN KEY ("psuId") REFERENCES "psus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "pc_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "storage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_coolerId_fkey" FOREIGN KEY ("coolerId") REFERENCES "cpu_coolers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
