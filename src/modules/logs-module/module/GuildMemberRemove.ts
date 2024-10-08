import BaseEvent from "@/abstractions/BaseEvent";
import SettingsService from "../settings/SetupService";
import { EmbedBuilder, Events, GuildMember, TextChannel } from "discord.js";
import { SnowflakeColors } from "@/enums";
import { discordTimestampFormat } from "@/libs/embeds-functions/discordTimestamp";
import { SnowflakeTimestamp } from "@/enums/SnowflkeTimestamp";
import Logger from "@/libs/core-functions/Logger";

export class GuildMemberAdd extends BaseEvent {
  constructor() {
    super({
      name: Events.GuildMemberRemove,
      once: false,
    });
  }

  async execute(member: GuildMember) {
    try {
      const settings = await SettingsService.findOne(member.guild.id);
      if (!settings) return;
      const { joins, enable } = settings;
      if (!enable) return
      const logChannel = (await member.guild.channels.fetch(joins, {
        cache: true,
      })) as TextChannel;
      if (!logChannel) return;
      try {
        const embed = new EmbedBuilder()
          .setTitle(`Пользователь покинул сервер ${member.guild.name}`)
          .setColor(SnowflakeColors.DEFAULT)
          .setFields(
            {
              name: `> Информация о пользователе`,
              value: `${member.user} | \`${member.user.id}\``,
              inline: true,
            },
            {
              name: `> Дата присоединения на сервер`,
              value: `${discordTimestampFormat(
                member.joinedTimestamp / 1000,
                SnowflakeTimestamp.LONG_DATE_WITH_DAY_OF_WEEK_AND_SHORT_TIME
              )}`,
              inline: true,
            },
            {
              name: `> Количество участников`,
              value: `\`${member.guild.memberCount}\``,
              inline: true,
            }
          )
          .setFooter({
            text: `${member.user.username} | ${member.user.id}`,
            iconURL: member.user.displayAvatarURL(),
          })
          .setThumbnail(member.user.displayAvatarURL())
          .setTimestamp(new Date());
        return await logChannel.send({ embeds: [embed] });
      } catch {}
    } catch (err) {
      Logger.error(err);
    }
  }
}
