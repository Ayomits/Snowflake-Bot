import BaseEvent from "@/abstractions/BaseEvent";

import { EconomyUserModel } from "@/db/models/economy/UserModel";

import { Client, Events, REST, Routes } from "discord.js";

export class ReadyEvent extends BaseEvent {
  constructor() {
    super({
      name: Events.ClientReady,
      once: true,
    });
  }

  async execute(client: Client) {
    return await Promise.all([this.collectAllUsers(client)]);
  }

  private async collectAllUsers(client: Client) {
    const allNotCreated = [];
    for (const [_, guild] of client.guilds.cache) {
      const dbUsers = (await EconomyUserModel.find({ guildId: guild.id })).map(
        (user) => user.userId
      );
      const notCreated = (await (await guild.fetch()).members.fetch())
        .filter((member) => {
          return !dbUsers.includes(member.id) && !member.user.bot;
        })
        .map((member) => {
          return new EconomyUserModel({ userId: member.id, guildId: guild.id });
        });
      await EconomyUserModel.insertMany(notCreated);
    }
  }
}
