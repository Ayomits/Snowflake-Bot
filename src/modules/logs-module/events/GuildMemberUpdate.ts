import BaseEvent from "@/abstractions/BaseEvent";
import {
  EmbedBuilder,
  Events,
  Guild,
  GuildMember,
  TextChannel,
} from "discord.js";
import SettingsService from "../../settings-module/log-settings-module/commands/SettingsService";
import { SnowflakeColors } from "@/enums";

export class GuildMemberUpdate extends BaseEvent {
  constructor() {
    super({
      name: Events.GuildMemberUpdate,
      once: false,
    });
  }

  async execute(oldMember: GuildMember, newMember: GuildMember) {
    const logChannel = await SettingsService.fetchLogChannel(
      newMember.guild,
      "members"
    );
    if (!logChannel) return;

    try {
      const embed = new EmbedBuilder()
        .setColor(SnowflakeColors.DEFAULT)
        .setAuthor({
          name: newMember.user.username,
          iconURL: newMember.displayAvatarURL(),
        })
        .setThumbnail(newMember.displayAvatarURL())
        .setTimestamp(new Date());

      const oldNickname = oldMember.nickname || oldMember.user.displayName;
      const newNickname = newMember.nickname || newMember.user.displayName;

      if (oldNickname !== newNickname) {
        embed.setTitle(`Изменение никнейма`).setFields(
          {
            name: `> Старый никнейм`,
            value: `\`\`\`${oldNickname.replaceAll("`", "")}\`\`\``,
          },
          {
            name: `> Новый никнейм`,
            value: `\`\`\`${newNickname.replaceAll("`", "")}\`\`\``,
          }
        );
      }

      if (
        oldMember.roles.cache.size < newMember.roles.cache.size ||
        oldMember.roles.cache.size > newMember.roles.cache.size
      ) {
        const newRoles = this.filterRoles(newMember, oldMember);
        const removedRoles = this.filterRoles(oldMember, newMember);

        embed.setTitle(`Действия с ролями участника`).setFields(
          {
            name: `> Добавленные роли`,
            value: `${newRoles.length >= 1 ? newRoles.join("\n") : "None"}`,
          },
          {
            name: `> Удалённые роли`,
            value: `${
              removedRoles.length >= 1 ? removedRoles.join("\n") : "None"
            }`,
          }
        );
      }

      if (oldMember.displayAvatarURL() !== newMember.displayAvatarURL()) {
        embed
          .setTitle(`Изменение аватара`)
          .setThumbnail(newMember.displayAvatarURL());
      }

      return logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error executing GuildMemberUpdate event:", error);
    }
  }

  private filterRoles(firstState: GuildMember, secondState: GuildMember) {
    return firstState.roles.cache
      .filter((role) => !secondState.roles.cache.has(role.id))
      .map((role) => role);
  }
}
