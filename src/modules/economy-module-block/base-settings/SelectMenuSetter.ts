import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction, ChannelSelectMenuInteraction } from "discord.js";
import { EconomySettingsModel } from "@/db/models/economy/EconomySettingsModel";
import { isEnabled } from "@/utils/functions/isEnabled";

export class EconomyBaseSettingsSetter extends BaseComponent {
  constructor() {
    super("economysetterselectmenu", 600);
  }

  async execute(interaction: ChannelSelectMenuInteraction, args: string[]) {
    await interaction.deferReply({ ephemeral: true });
    const values = interaction.values;
    await EconomySettingsModel.updateOne(
      { guildId: interaction.guild.id },
      {
        $set: {
          [args[0]]: values,
        },
      }
    );
    return interaction.editReply({ content: `Данные были обновлены` });
  }
}
