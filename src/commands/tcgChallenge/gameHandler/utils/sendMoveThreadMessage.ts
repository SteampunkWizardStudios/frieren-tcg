import { buildThreadLink } from "@src/util/formatting/links";

import {
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ButtonBuilder,
  ButtonStyle,
  ThreadChannel,
  User,
  MessageFlags,
} from "discord.js";

const sendMoveThreadMessage = (
  thread: ThreadChannel,
  user: User,
  selectionThread: ThreadChannel
) => {
  thread.send({
    components: [
      new ContainerBuilder().addSectionComponents(
        new SectionBuilder()
          .setButtonAccessory(
            new ButtonBuilder()
              .setLabel("Go to Thread")
              .setStyle(ButtonStyle.Link)
              .setURL(buildThreadLink(selectionThread.id))
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `${user}, choose your character!`
            )
          )
      ),
    ],
    flags: MessageFlags.IsComponentsV2,
  });
};

export default sendMoveThreadMessage;
