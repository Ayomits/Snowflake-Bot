import {
  AnySelectMenuInteraction,
  ChannelSelectMenuInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
} from "discord.js";

export default abstract class BaseSelectMenuValue {
  declare readonly value: string;
  constructor(value: string) {
    this.value = value;
  }
  public async execute(
    _interaction: StringSelectMenuInteraction,
    _args: string[]
  ): Promise<any> {}
}
