/*
  Warnings:

  - You are about to drop the column `restrictRandomToFavourites` on the `PlayerPreferences` table. All the data in the column will be lost.
  - You are about to drop the `_PlayerRandomCharacterWhitelist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlayerRandomCharacterWhitelist" DROP CONSTRAINT "_PlayerRandomCharacterWhitelist_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlayerRandomCharacterWhitelist" DROP CONSTRAINT "_PlayerRandomCharacterWhitelist_B_fkey";

-- AlterTable
ALTER TABLE "PlayerPreferences" DROP COLUMN "restrictRandomToFavourites";

-- DropTable
DROP TABLE "_PlayerRandomCharacterWhitelist";
