const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const db = require("quick.db");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')


module.exports = {
   name: "راتب",
   aliases: ["راتبي", "رواتب"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {

      const userBanks = await bank.findOne({ userID: message.author.id });
      if (!userBanks) {
         let profile = await bank.create({
            userID: message.author.id,
            money: 0,
            user: message.author.tag,
            GuildID: message.guild.id,
            accountage: message.createdTimestamp,
            attemptratb: 0,
         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }
      const userBank = await bank.findOne({ userID: message.author.id });

      if (message.author.tag !== userBank.user) {
         bank.findOneAndUpdate({ userID: message.author.id }, { $set: { user: message.author.tag } })
      }
      const cooldown = cooldowns.get(message.author.id);
      if (cooldown) {
         const remaining = humanizeDuration(cooldown - Date.now());

         return message.reply(`:x: | **\`${remaining}\` , انتظر لاهنت**`)
            .catch(console.error);
      }

      cooldowns.set(message.author.id, Date.now() + 300000);
      setTimeout(() => cooldowns.delete(message.author.id), 300000);

      
      const random = Math.floor(Math.random() * 10000) + 1;

         let job = [
            "عسكري",
            "طبيب",
            "خدام",
            "مبرمج",
            "مباحث",
            "عامل نظافة",
            "رسام",
            "اداري",
         ]
         let res = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: random } });
         if (!res) return message.reply('Something went wrong: contact the developer')
         const balance = await bank.findOne({ userID: message.author.id });
         if (!balance.ratb) { await bank.findOneAndUpdate({ userID: message.author.id }, { $set: { ratb: message.createdTimestamp } }) } else { await bank.findOneAndUpdate({ userID: message.author.id }, { $set: { ratb: message.createdTimestamp } }) }
         let embed = new Discord.MessageEmbed()
            .setThumbnail("https://cdn.discordapp.com/attachments/947898070845247529/967517907879866420/781835.png?size=4096")
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL()})
            .setTitle("اشعار ايداع 💰")
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL()})
            .setColor("RANDOM")
            .setDescription(`
المبلغ: \`${random}\`$
الوظيفة: \`${job[Math.floor(Math.random() * job.length)]}\`
 رصيدك الحالي: \`${balance.money.toLocaleString()}\`$`)
         const msgt = message.reply({ embeds: [embed] });
         

   },
};
