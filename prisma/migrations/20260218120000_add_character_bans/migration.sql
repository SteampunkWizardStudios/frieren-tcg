-- Add ranked flag to Match
ALTER TABLE "Match" ADD COLUMN "ranked" BOOLEAN NOT NULL DEFAULT FALSE;

-- Create CharacterBan table
CREATE TABLE "CharacterBan" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,
    CONSTRAINT "CharacterBan_pkey" PRIMARY KEY ("id")
);

-- Ensure unique character per match
CREATE UNIQUE INDEX "CharacterBan_matchId_characterId_key" ON "CharacterBan" ("matchId", "characterId");

-- Foreign keys
ALTER TABLE "CharacterBan" ADD CONSTRAINT "CharacterBan_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterBan" ADD CONSTRAINT "CharacterBan_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
