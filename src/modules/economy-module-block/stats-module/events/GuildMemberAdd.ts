import BaseEvent from "@/abstractions/BaseEvent";
import { EconomyUserModel } from "@/db/models/economy/UserModel";
import { Events, GuildMember } from "discord.js";

export class GuildMemberAdd extends BaseEvent {
  constructor() {
    super({
      name: Events.GuildMemberAdd,
      once: false,
    });
  }

  async execute(member: GuildMember) {
    return await EconomyUserModel.create({
      userId: member.id,
      guildId: member.guild.id,
    });
  }
}
