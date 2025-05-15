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

  // @ts-expect-error Dynamic table name
  const data = await prismaClient[table].findMany();

  if (!data || data.length === 0) {
    await interaction.editReply({
      content: `Table \`${table}\` returned no data.`,
    });
    return;
  }

  try {
    const csvData = stringify(data, { header: true });
    const attachment = new AttachmentBuilder(Buffer.from(csvData), {
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
