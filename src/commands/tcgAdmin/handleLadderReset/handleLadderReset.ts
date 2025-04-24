import { ButtonInteraction, MessageFlags } from "discord.js";
import prismaClient from "@prismaClient";

export default async function handleLadderReset(i: ButtonInteraction) {
  await i.deferReply({ flags: MessageFlags.Ephemeral });

  try {
    await prismaClient.$transaction(async (tx) => {
      const activeResets = await tx.ladderReset.findMany({
        where: { endDate: null },
      });

      await tx.ladderReset.updateMany({
        where: { endDate: null },
        data: { endDate: new Date() },
      });

      await Promise.all(
        activeResets.map((reset) =>
          tx.ladderReset.create({
            data: { ladder: { connect: { id: reset.ladderId } } },
          })
        )
      );
    });
  } catch (error) {
    console.error("Error handling ladder reset:", error);
    await i.editReply({
      content: "An error occurred while handling the ladder reset.",
    });
    return;
  }

  await i.editReply({
    content: "Ladder reset handled successfully!",
  });
}
