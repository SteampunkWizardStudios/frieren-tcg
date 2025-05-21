import { ChatInputCommandInteraction, AttachmentBuilder } from "discord.js";
import getTables from "@src/util/db/getTables";
import prismaClient from "@prismaClient";
import { stringify } from "csv-stringify/sync";

export default async function exportTable(
  interaction: ChatInputCommandInteraction
) {
  const table = interaction.options.getString("table", true);
  const tables = await getTables();

  if (!tables.includes(table)) {
    await interaction.editReply({
      content: `Table \`${table}\` not found.`,
    });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await (prismaClient as any)[table].findMany(); // Use dynamic access to the table

  if (!data || data.length === 0) {
    await interaction.editReply({
      content: `Table \`${table}\` returned no data.`,
    });
    return;
  }

  try {
    if (!Array.isArray(data)) {
      throw new Error(
        `Unexpected data format for table \`${table}\`. Expected an array.`
      );
    }

    const csvData = stringify(data, { header: true });
    const attachment = new AttachmentBuilder(Buffer.from(csvData, "utf-8"), {
      name: `${table}.csv`,
    });

    await interaction.editReply({
      content: `Data for table \`${table}\`:`,
      files: [attachment],
    });
  } catch (error) {
    console.error("Failed to stringify or send table data:", error);
    await interaction.editReply({
      content: `Sorry, an error occurred while preparing the csv for table \`${table}\`.`,
    });
  }
}
