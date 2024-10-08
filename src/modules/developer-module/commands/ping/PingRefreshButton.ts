import BaseComponent from "@/abstractions/BaseComponent";
import { ButtonInteraction } from "discord.js";
import { pingResponse } from "./PingResponse";

export class PingRefreshButton extends BaseComponent {
  constructor() {
    super({
      customId: "pingRefresh",
      ttl: 600,
      authorOnly: true,
    });
  }
  async execute(interaction: ButtonInteraction, args: string[]) {
    await interaction.deferUpdate();
    const userId = args[0];
    if (userId !== interaction.user.id) return;
    return interaction.editReply(pingResponse(interaction));
  }
}
