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

  const data = await prismaClient[table].findMany();

  if (!data || data.length === 0) {
    await interaction.editReply({
      content: `Table \`${table}\` returned no data.`,
    });
    return;
  }

  console.log(`Data for table \`${table}\`:`, data);

  try {
    if (!Array.isArray(data)) {
      throw new Error(
        `Unexpected data format for table \`${table}\`. Expected an array.`
      );
    }

    const csvData = stringify(data, { header: true });
	console.log(`CSV data for table \`${table}\`:`, csvData);
    const attachment = new AttachmentBuilder(Buffer.from(csvData, "utf-8"), {
      name: `${table}.csv`,
    });
	console.log(`Attachment created for table \`${table}\`:`, attachment);	

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
