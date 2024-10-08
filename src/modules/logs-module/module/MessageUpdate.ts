import BaseEvent from "@/abstractions/BaseEvent";
import { EmbedBuilder, Events, Message, TextChannel } from "discord.js";
import SettingsService from "../settings/SetupService";
import { SnowflakeColors } from "@/enums";
import Logger from "@/libs/core-functions/Logger";

import { error } from "console";

export class MessageUpdate extends BaseEvent {
  constructor() {
    super({
      once: false,
      name: Events.MessageUpdate,
    });
  }

  async execute(oldMessage: Message, newMessage: Message) {
    try {
      if (oldMessage.author.bot) return;
      const settings = await SettingsService.findOne(newMessage.guild.id);
      if (!settings) return;
      const { messages, enable } = settings;
      if (!enable) return
      const logChannel = (await newMessage.guild.channels.fetch(messages, {
        cache: true,
      })) as TextChannel;
      if (!logChannel) return;
      const oldContent = oldMessage.content.replaceAll("`", "");
      const newContent = newMessage.content.replaceAll("`", "");

      const embed = new EmbedBuilder()
        .setTitle(`Редактирование сообщения`)
        .setColor(SnowflakeColors.DEFAULT)
        .setFields(
          {
            name: `> Канал`,
            value: `${oldMessage.channel}`,
            inline: true,
          },
          {
            name: `> Сообщение`,
            value: `${oldMessage.url}`,
            inline: true,
          },
          {
            name: `> Автор`,
            value: `${oldMessage.author}`,
            inline: true,
          },
          {
            name: `> Старое содержимое:`,
            value: `${
              oldContent.length >= 1 ? "```" + oldContent + "```" : "None"
            }`,
            inline: false,
          },
          {
            name: `> Новое содержимое:`,
            value: `${
              newContent.length >= 1 ? "```" + newContent + "```" : "None"
            }`,
            inline: false,
          }
        )
        .setThumbnail(oldMessage.author.displayAvatarURL())
        .setTimestamp(new Date())
        .setFooter({
          text: `${oldMessage.author.globalName} | ${oldMessage.author.id}`,
          iconURL: oldMessage.author.displayAvatarURL(),
        });

      let content = ``;
      if (oldMessage.attachments) {
        content += oldMessage.attachments
          .map((attachment) => attachment.url)
          .join("\n");
      }

      try {
        return logChannel
          .send({
            content: content.length >= 1 ? content : null,
            embeds: [embed],
          })
          .then(() =>
            Logger.log(
              `message update event logged (authorId: ${oldMessage.author.id}, guildId: ${oldMessage.guild.id})`
            )
          );
      } catch (err) {
        Logger.error(err);
      }
    } catch (err) {
      Logger.error(err);
    }
  }
}
