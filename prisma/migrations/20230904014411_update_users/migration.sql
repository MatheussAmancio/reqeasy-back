/*
  Warnings:

  - You are about to drop the `ItensLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ItensLog";

-- CreateTable
CREATE TABLE "ItemsLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "ItemsLog_pkey" PRIMARY KEY ("id")
);
