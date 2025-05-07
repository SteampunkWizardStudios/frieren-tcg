import {
  ChatInputCommandInteraction,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
} from "discord.js";
import { CharacterEmoji, CardEmoji } from "@tcg/formatting/emojis";

export default async function showEmojiList(
  interaction: ChatInputCommandInteraction
) {
  const characterEmojis = mapEmojis(CharacterEmoji);
  const cardEmojis = mapEmojis(CardEmoji);

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent("## Character Emojis")
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(characterEmojis)
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent("## Card Emojis")
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(cardEmojis));

  await interaction.reply({
    components: [container],
    flags: ["IsComponentsV2", "Ephemeral"],
  });
}

function mapEmojis(emojis: Record<string, string>) {
  return Object.entries(emojis)
    .map(([key, value]) => {
      return `${formatKey(key)}: ${value}`;
    })
    .join("\n");
}

function formatKey(key: string): string {
  return key
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
