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

const sendMoveThreadMessage = (thread: ThreadChannel, user: User) => {
  thread.send({
    components: [
      new ContainerBuilder().addSectionComponents(
        new SectionBuilder()
          .setButtonAccessory(
            new ButtonBuilder()
              .setLabel("Move Thread")
              .setStyle(ButtonStyle.Link)
              .setURL(buildThreadLink(thread.id))
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`${user}, choose your move!`)
          )
      ),
    ],
	flags: MessageFlags.IsComponentsV2
  });
};

export default sendMoveThreadMessage;
