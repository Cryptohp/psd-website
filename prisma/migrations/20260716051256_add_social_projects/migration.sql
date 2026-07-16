-- CreateTable
CREATE TABLE "social_projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "shortDesc" TEXT,
    "description" TEXT,
    "thumbnail" TEXT,
    "images" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_projects_pkey" PRIMARY KEY ("id")
);
