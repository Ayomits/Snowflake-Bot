import BaseComponent from "@/abstractions/BaseComponent";
import { ReactionModuleModel } from "@/db/models/economy/ReactionsModel";
import { ChannelSelectMenuInteraction } from "discord.js";

export class ReactionsChannelsSetup extends BaseComponent {
  constructor() {
    super({
      customId: "setupRolesChannels",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ChannelSelectMenuInteraction, args: string[]) {
    const values = interaction.values;
    const authorId = args[2];
    const field = args[0];
    if (authorId !== interaction.user.id) return;
    await interaction.deferReply({ ephemeral: true });
    await ReactionModuleModel.updateOne(
      {
        guildId: args[1],
      },
      {
        [field]: values,
      }
    );
    return interaction.editReply({
      content: `Каналы успешно установлены! Нажмите на кнопку "обновить" чтобы увидеть изменения!`,
    });
  }
}
