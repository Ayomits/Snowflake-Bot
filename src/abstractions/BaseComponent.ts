import { ComponentOptions } from "@/types/options/ComponentConfig";
import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
} from "discord.js";

export default abstract class BaseComponent {
  declare readonly customId: string;
  declare readonly ttl: number | null | undefined;
  declare readonly authorOnly: boolean;
  constructor(
    customId: string,
    ttl: number = null,
    authorOnly: boolean = true
  ) {
    this.customId = customId;
    this.ttl = ttl;
    this.authorOnly = authorOnly;
  }
  execute(
    _interaction:
      | ButtonInteraction
      | ModalSubmitInteraction
      | StringSelectMenuInteraction
      | RoleSelectMenuInteraction
      | ChannelSelectMenuInteraction
      | AnySelectMenuInteraction,
    _args?: string[]
  ) {}
}
