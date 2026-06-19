import { ChatInputCommandInteraction, ContainerBuilder } from "discord.js";
import { statDetails } from "@tcg/formatting/emojis";
import { sendInfoContainer } from "./util/sendInfoMessage";

const aboutText = [
  "## About",
  "In https://discord.com/channels/738445835234181211/1357179037428088862 you can play Frierencord's community-developed Frieren-themed card game with other servers members in turn-based combat.",
  "You can start playing by running `/tcg-challenge`",
  "Once someone joins your match, you will be added to a *game thread* where you can see the action and a *move select thread* where you choose your moves each turn.",
  "In your move select thread, start by picking a character. Characters have different stats, abilities and decks.",
  "-# Note: All cards are provided as part of your chosen character's deck. No card collecting needed!",
];
const gameplayText = [
  "## Gameplay",
  "### Your Hand",
  "When the game starts, you are drawn 6 cards into your hand from your *Draw Pile* and they're numbered 0-5. Four dice are rolled to determine which cards are activated for each turn.",
  "Once you play a card, it is discarded into your *Discard Pile* and you draw a new card. Once your Draw Pile is empty, your Discard Pile is shuffled and it becomes your new Draw Pile. Most cards have at least one copy, meaning you can play it multiple times before you reshuffle.",
  `There's two extra actions you can always take: **Wait** heals for ${statDetails.HP.emoji} 10 HP, and **Discard** discards your activated cards and draws the same number of cards.`,
  "### Empowerment",
  "Empowerment increases the effectiveness of your cards, starting at 0. For every level, the **bolded** numbers in the card's description increase by 10%.",
  "Ex.) Fern's Zoltraak + 0 deals deals 7 base damage, and Zoltraak + 5 deals 10.5 damage.",
  "Empowerment is increased when:",
  "- During activation, you roll a repeat, each duplicate rolled increases empowerment.",
  "- At the end of the turn, every active card that was not played is empowered.",
  "- Playing **Wait** which empowers all cards in your hand.",
  "- Playing **Discard** which empowers all cards in your hand that were not discarded.",
  "### Your Turn",
  "Once both players select a move, the results are shown in the game thread.",
];
const statsText = [
  "## Stats",
  `- ${statDetails.HP.emoji} **HP**: Health - If it hits 0, you lose.`,
  `- ${statDetails.ATK.emoji} **ATK**: Attack - Increases the damage you deal by a flat amount.`,
  `- ${statDetails.DEF.emoji} **DEF**: Defense - Reduces the damage you take by a flat amount.`,
  `- ${statDetails.SPD.emoji} **SPD**: Speed - Determines who moves first`,
];
const charactersText = [
  "## Characters",
  "There are 17 character with unique stats, abilities, and decks.",
  "You can view each character and their deck with `/tcg-info character`",
];
const welcomeText = [
  "Those are the basics of Frieren TCG, but there's some additional rules and cases that you can read about with `/tcg-info guide-extra`",
  "Also check out https://discord.com/channels/738445835234181211/1357740768349126686 for news and updates and https://discord.com/channels/738445835234181211/1359535195828654403 to discuss the game.",
  "Have fun and see you in the city!",
];
const sections = [
  aboutText,
  gameplayText,
  statsText,
  charactersText,
  welcomeText,
];

const container = new ContainerBuilder()
  .setAccentColor(0xc5c3cc)
  .addTextDisplayComponents((t) => t.setContent("# Frieren TCG - Guide"));
for (const section of sections) {
  container.addTextDisplayComponents((t) => t.setContent(section.join("\n")));
}

export async function showGameHowToPlay(
  interaction: ChatInputCommandInteraction
) {
  sendInfoContainer(interaction, container);
}

/* export async function showGameHowToPlay(
  interaction: ChatInputCommandInteraction
) {
  const isDetailed = interaction.options.getBoolean("detailed");

  const embed = new EmbedBuilder()
    .setColor(0xc5c3cc)
    .setTimestamp()
    .setFooter({ text: "Have fun!" });

  if (!isDetailed) {
    embed.setTitle("Frieren TCG - How to Play").addFields({
      name: "How To Play",
      value: [
        `- Every turn, you are given **a list of moves** to use.`,
        `- Whoever has the **higher ${statDetails.SPD.emoji} SPD** will move **first**.`,
        `- You **win** when **your opponent's ${statDetails.HP.emoji} HP drops to 0**!`,
      ].join("\n"),
    });
  } else {
    embed.setTitle("Frieren TCG - Detailed Ruleset").addFields(
      {
        name: "Character and Stats",
        value: [
          `- ${statDetails.HP.emoji} **HP**: Health Points - If this **becomes 0 or less than 0**, the character **loses**.`,
          `A character's **own move**, unless specified, **cannot** bring the user's ${statDetails.HP.emoji} HP to **less than 1**.`,
          `This means that the only way for your ${statDetails.HP.emoji} HP to drop to 0 is if it's **at the effect of your opponent's move**.`,
          `- ${statDetails.ATK.emoji} **ATK**: Attack`,
          `- ${statDetails.DEF.emoji} **DEF**: Defense`,
          `- ${statDetails.SPD.emoji} **SPD**: Speed - determines who moves first`,
        ].join("\n"),
      },
      {
        name: "Gameplay",
        value: [
          `Every turn:`,
          `- Both characters **draw 6 cards** from their deck and **roll 4d6**.`,
          `    - The results of the 4d6 determines **which of the 6 cards** the character can use that turn.`,
          `    - If there is **a repeat**, the card is **Empowered**, increasing its effect.`,
          `- Players then choose 1 card to use.`,
          `    - Players can also choose to either **Discard** all cards they can use that turn and draw the same number of cards discarded, or **Wait** and heal 10 HP.`,
          `- After the card is used, it is **saved in a discard pile**. Draw a new card.`,
          `    - Every cards that **were not used** that turn is **Empowered**, increasing their effects.`,
          `    - If there is no longer a new card to draw, **shuffle the discard pile** and start drawing from there.`,
          `- The game **ends** when **one of the player's ${statDetails.HP.emoji} HP reaches 0.**`,
        ].join("\n"),
      }
    );
  }

  sendInfoMessage(interaction, embed, []);
}
 */
