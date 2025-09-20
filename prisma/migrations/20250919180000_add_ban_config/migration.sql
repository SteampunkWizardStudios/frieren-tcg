-- CreateTable
CREATE TABLE "BanConfig" (
    "id" TEXT NOT NULL DEFAULT 'ban-config',
    "maxCount" INTEGER NOT NULL DEFAULT 0,
    "enabledRanked" BOOLEAN NOT NULL DEFAULT FALSE,
    "enabledUnranked" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "BanConfig_pkey" PRIMARY KEY ("id")
);

-- Seed singleton row
INSERT INTO "BanConfig" ("id")
VALUES ('ban-config')
ON CONFLICT ("id") DO NOTHING;
