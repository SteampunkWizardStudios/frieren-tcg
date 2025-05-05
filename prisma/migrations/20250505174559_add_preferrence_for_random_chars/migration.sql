-- AlterTable
ALTER TABLE "PlayerPreferences" ADD COLUMN     "restrictRandomToFavourites" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_PlayerRandomCharacterWhitelist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlayerRandomCharacterWhitelist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlayerRandomCharacterWhitelist_B_index" ON "_PlayerRandomCharacterWhitelist"("B");

-- AddForeignKey
ALTER TABLE "_PlayerRandomCharacterWhitelist" ADD CONSTRAINT "_PlayerRandomCharacterWhitelist_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerRandomCharacterWhitelist" ADD CONSTRAINT "_PlayerRandomCharacterWhitelist_B_fkey" FOREIGN KEY ("B") REFERENCES "PlayerPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
