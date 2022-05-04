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
   name: "دين",
   aliases: ["طلب", "اطلب", "عطني"],
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

      if (!args[0]) return message.reply("**:x: | منشن الشخص الي تبي تطلب دين منه**");
      if (!args[1]) return message.reply("**:x: | اكتب المبلغ الي تبي تطلبه**");
      if (isNaN(args[1])) return message.reply(`يرجى كتابة الامر بالطريقة الصحيحة \n> \`دين @منشن المبلغ#\``);
      if (args[1] > 100000000) return message.reply("**:x: | المبلغ الي طلبته عالي, تقدر تطلب 100,000,000 ريال كحد اقصى**");

      let member = message.mentions.members.first();
      if (member.id === message.author.id) return message.reply("تبي تطلب دين من نفسك يا اهبل ؟");
      if (!member) return message.reply("منشن شخص موجود بالسيرفر عشان تطلب دين منه");
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
      if (authorvalue > membermoney) return message.reply('المبلغ الي طلبته اكثر من فلوس الشخص')


      cooldowns.set(message.author.id, Date.now() + 300000);
      setTimeout(() => cooldowns.delete(message.author.id), 300000);

      const ConfirmEmbed = new MessageEmbed()
         .setDescription(`${message.author} | طلب منك دين بقيمة : ${args[1]} ريال 
> يرجى الرد بالضغط على تحويل او رفض`)
         .setColor('ORANGE')
      const row = new MessageActionRow()
         .addComponents(
            new MessageButton()
               .setLabel('تحويل')
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
            time: 15000,
            componentType: "BUTTON",
         })

         collector.on("collect", async (i) => {

            const row = new MessageActionRow()
               .addComponents(
                  new MessageButton()
                     .setLabel('تحويل')
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
               const dembed = new MessageEmbed()
                  .setDescription(`${message.author} | تم تحويل مبلغ ${args[1]} ريال بنجاح`)
                  .setColor('GREEN')
               if (i.user.id !== member.id) return i.reply({
                  content: "مالك دخل ياملقوف :)",
                  ephemeral: true
               })

               i.deferUpdate()
               m.edit({ embeds: [dembed], components: [row] });
               const Aresponse = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: args[1] } });
               const Mresponse = await bank.findOneAndUpdate({ userID: member.user.id }, { $inc: { money: -args[1] } });
            }
            if (i.customId === "decline") {
               const dembed = new MessageEmbed()
                  .setDescription(`تم رفض العملية`)
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
                     .setLabel('تحويل')
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
               const dembed = new MessageEmbed()
                  .setDescription(`تم رفض العملية بسبب عدم استجابه العضو`)
                  .setColor('RED')
               m.edit({ components: [row] });
            }
         }
         )
      })




   },
};
