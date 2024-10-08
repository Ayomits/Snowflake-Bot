import BaseComponent from "@/abstractions/BaseComponent";
import { SetResponseTo } from "@/libs/components-functions/SetResponseTo";
import { ButtonInteraction } from "discord.js";
import { TeleportSettingsResponse } from "../../Response";
import { SetTogglerTo } from "@/libs/components-functions/TogglerTo";
import { TeleportSettingsModel } from "@/db/models/teleport/TeleportSettingsModel";

export class TeleportSettingsToggler extends BaseComponent {
  constructor() {
    super({
      customId: "teleportsettingstoggler",
      ttl: 600,
      authorOnly: true,
    });
  }

  async execute(interaction: ButtonInteraction) {
    try {
      await SetTogglerTo({
        interaction,
        model: TeleportSettingsModel,
        moduleName: "телепортов",
        ephemeral: true,
        field: "enable",
      });
    } catch {}
  }
}
