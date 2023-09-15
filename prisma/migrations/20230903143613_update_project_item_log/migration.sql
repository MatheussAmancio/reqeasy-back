-- CreateTable
CREATE TABLE "ItensLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "ItensLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitesProject" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3),

    CONSTRAINT "InvitesProject_pkey" PRIMARY KEY ("id")
);
