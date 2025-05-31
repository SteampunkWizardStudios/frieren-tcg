import {
  ContainerBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  SectionBuilder,
  ButtonBuilder,
  ButtonStyle,
  User,
} from "discord.js";

import { buildThreadLink } from "@src/util/formatting/links";
import { CharacterName } from "@src/tcg/characters/metadata/CharacterName";
import { TCGResult } from "@src/tcgMain";
import { DatabaseOperationResult } from "@src/commands/tcgChallenge/gameHandler/handleDatabaseOperations";
import { charWithEmoji } from "@src/tcg/formatting/emojis";
import { CHARACTER_MAP } from "@src/tcg/characters/characterList";
import { Rank } from "@src/commands/tcgChallenge/gameHandler/rankScoresToRankTitleMapping";

type BattleResultsOptions = {
  gameRes: TCGResult & {
    challenger: User;
    opponent: User;
  };
  dbRes?: DatabaseOperationResult; // if undefined, it means the game was not ranked or was tied
  threadId: string;
};

export default function buildBattleResults({
  gameRes,
  dbRes,
  threadId,
}: BattleResultsOptions) {
  const { challenger, opponent } = gameRes;

  const playerOneSection = perPlayerSectionLogic({
    isFirst: true,
    user: gameRes.winner ?? challenger,
    character: gameRes.winnerCharacter ?? gameRes.challengerCharacter,
    rank: dbRes?.winnerRank,
    rankedChange: dbRes?.winnerRankedUp,
    newRank: dbRes?.winnerNewRank,
    scoreChange: dbRes?.winnerScoreGain,
  });

  const playerTwoSection = perPlayerSectionLogic({
    isFirst: false,
    user: gameRes.loser ?? opponent,
    character: gameRes.loserCharacter ?? gameRes.opponentCharacter,
    rank: dbRes?.loserRank,
    rankedChange: dbRes?.loserRankedDown,
    newRank: dbRes?.loserNewRank,
    scoreChange: dbRes?.loserScoreLoss,
  });

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent("### Battle Results")
    )
    .addTextDisplayComponents(playerOneSection.line)
    .addSectionComponents(playerOneSection.section)
    .addTextDisplayComponents(playerTwoSection.line)
    .addSectionComponents(
      playerTwoSection.section,
      new SectionBuilder()
        .setButtonAccessory(
          new ButtonBuilder()
            .setLabel("Thread")
            .setStyle(ButtonStyle.Link)
            .setURL(buildThreadLink(threadId))
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`-# Game ID: ${threadId}`)
        )
    )
    .setAccentColor(0xffffff);

  return container;
}

const perPlayerSectionLogic = ({
  isFirst,
  user,
  character,
  rank,
  rankedChange,
  newRank,
  scoreChange,
}: {
  isFirst: boolean;
  user: User;
  character: CharacterName | undefined;
  rank: Rank | null | undefined;
  rankedChange: boolean | undefined | null;
  newRank: Rank | null | undefined;
  scoreChange: number | undefined;
}) => {
  const line = new TextDisplayBuilder().setContent(
    isFirst ? `**Winner** <@${user.id}>` : `**Loser** <@${user.id}>`
  );

  const rankLine = rankedChange
    ? `Rank ${isFirst ? "up!" : "down..."} New rank: **${newRank}**`
    : rank
      ? `Rank: ${rank}`
      : "Unranked";

  const rankPointsLine = newRank
    ? `Rank Points: ${newRank}${
        scoreChange
          ? scoreChange > 0
            ? ` (+**${scoreChange}**)`
            : ` (-**${Math.abs(scoreChange)}**)`
          : ""
      }`
    : null;

  const charFormatted = character ? charWithEmoji(character) : "Unselected";
  const charLink = character
    ? CHARACTER_MAP[character]?.cosmetic?.imageUrl
    : undefined;

  const section = buildPlayerSection(
    charFormatted,
    rankLine,
    rankPointsLine,
    charLink
  );

  return { line, section };
};

const buildPlayerSection = (
  charFormatted: string,
  rankLine?: string,
  rankPointsLine?: string | null,
  charLink?: string
) => {
  const section = new SectionBuilder();

  if (rankLine) {
    section.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(rankLine)
    );
  }
  if (rankPointsLine) {
    section.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(rankPointsLine)
    );
  }

  section.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(`Character: ${charFormatted}`)
  );

  if (charLink) {
    section.setThumbnailAccessory(new ThumbnailBuilder().setURL(charLink));
  }
  return section;
};
