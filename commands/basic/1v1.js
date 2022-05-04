const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const ms = require("ms");
const talkedRecently = new Set();
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
const {
   MessageEmbed,
   MessageActionRow,
   MessageButton
} = require('discord.js')
module.exports = {
   name: "1v1",
   aliases: ["فايت", "عشوائي", "اليانصيب"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      const userBank = await bank.findOne({ userID: message.author.id });
      if (!userBank) {
         let profile = await bank.create({
            userID: message.author.id,
            money: 0,
            user: message.author.tag,
            GuildID: message.guild.id,
            accountage: message.createdTimestamp,
            attempt: 0,
         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }

      const cooldown = cooldowns.get(message.author.id);
      if (cooldown) {
         const remaining = humanizeDuration(cooldown - Date.now());

         return message.reply(`:x: | **\`${remaining}\` , انتظر لاهنت**`)
            .catch(console.error);
      }

      if (!args[0]) return message.reply("**:x: | منشن الشخص الي تبي تلعب معه**");
      let member = message.mentions.members.first();
      if (member.id === message.author.id) return message.reply("تبي تلعب مع نفسك يا اهبل ؟");
      if (member.user.bot) return message.reply("**:x: | لا يمكنك اللعب مع بوت**");
      if (!member) return message.reply("منشن شخص موجود بالسيرفر");
      if (!args[1]) return message.reply("**:x: | اكتب المبلغ الي تبي تنزل فيه**");
      const memberBank = await bank.findOne({ userID: member.user.id });
      if (!memberBank) {
         let profile = await bank.create({
            userID: member.user.id,
            user: member.user.tag,
            money: 0,
            GuildID: message.guild.id,
            accountage: message.createdTimestamp,
         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }
      let authorvalue = args[1]
      let membermoney = memberBank.money
      if (authorvalue > membermoney) return message.reply('المبلغ اكثر من فلوس العضو')
      if (authorvalue > userBank.money) return message.reply('انت لا تملك هذا المبلغ')


      cooldowns.set(message.author.id, Date.now() + 300000);
      setTimeout(() => cooldowns.delete(message.author.id), 300000);

      const ConfirmEmbed = new MessageEmbed()
         .setThumbnail('https://e-football-dl.konami.net/pesleague/archive/2019/wp-content/uploads/1v1-icon.png')
         .setDescription(`يريد اللعب معك على مبلغ **${args[1].toLocaleString()}$**

> الاختيار عشوائي
> الفائز يحصل على دبل المبلغ
> يرجى الرد موافق او رفض لديك 10 ثوان`)
         .setColor('ORANGE')
      const row = new MessageActionRow()
         .addComponents(
            new MessageButton()
               .setLabel('موافق')
               .setStyle('PRIMARY')
               .setCustomId('accept')
         )
         .addComponents(
            new MessageButton()
               .setLabel('رفض')
               .setStyle('DANGER')
               .setCustomId('decline')
         );
      message.reply({
         embeds: [ConfirmEmbed],
         components: [row],
         content: `${member}`,
      }).then(m => {
         const collector = message.channel.createMessageComponentCollector({
            time: 10000,
            componentType: "BUTTON",
         })

         collector.on("collect", async (i) => {

            const row = new MessageActionRow()
               .addComponents(
                  new MessageButton()
                     .setLabel('موافق')
                     .setStyle('PRIMARY')
                     .setCustomId('accept')
                     .setDisabled()
               )
               .addComponents(
                  new MessageButton()
                     .setLabel('رفض')
                     .setStyle('DANGER')
                     .setCustomId('decline')
                     .setDisabled()
               );
            if (i.customId === "accept") {
               if (i.user.id !== member.id) return i.reply({
                  content: "مالك دخل ياملقوف :)",
                  ephemeral: true
               })
               const Aresponse = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: -args[1] } });
               const Mresponse = await bank.findOneAndUpdate({ userID: member.user.id }, { $inc: { money: -args[1] } });
               let users = [
                  `${message.author.id}`,
                  `${member.user.id}`
               ]
               const pickrandom = users[Math.floor(Math.random() * users.length)];
               const winner = await bank.findOne({ userID: pickrandom });
               let final = args[1] * 2
               const Aresponse1 = await bank.findOneAndUpdate({ userID: pickrandom }, { $inc: { money: final } });
               const winnerbal = await bank.findOne({ userID: pickrandom });



               const dembed = new MessageEmbed()
                  .setTitle('مبرووووووك !')
                  .setThumbnail('https://i.imgur.com/r3U22Xj.png')
                  .setAuthor({ name: `${message.guild.name}`, icon_url: `${message.guild.iconURL()}` })
                  .setDescription(`الفائز هو : <@${pickrandom}>
> الجائزة : **${final.toLocaleString()}$**
> رصيد الفائز قبل **${winner.money.toLocaleString()}$**
> رصيد الفائز بعد **${winnerbal.money.toLocaleString()}$**`)

                  .setColor('GREEN')
               i.deferUpdate()
               m.edit({ embeds: [dembed], components: [row] });
            }
            if (i.customId === "decline") {
               const dembed = new MessageEmbed()
                  .setDescription(`تم رفض اللعبه`)
                  .setColor('RED')
               if (i.user.id !== member.id) return i.reply({
                  content: "مالك دخل ياملقوف :)",
                  ephemeral: true
               })

               i.deferUpdate()
               m.edit({ embeds: [dembed], components: [row] });

            }
         })
         collector.on("end", async (collected, reason) => {
            const row = new MessageActionRow()
               .addComponents(
                  new MessageButton()
                     .setLabel('موافق')
                     .setStyle('PRIMARY')
                     .setCustomId('accept')
                     .setDisabled()
               )
               .addComponents(
                  new MessageButton()
                     .setLabel('رفض')
                     .setStyle('DANGER')
                     .setCustomId('decline')
                     .setDisabled()
               );
            if (reason === "time") {
               m.edit({ components: [row] });
            }
         }
         )
         
      })
      



   },
};
