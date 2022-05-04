const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
const store = require("../../models/store.js");
const db = require("quick.db");

module.exports = {
   name: "ازرف",
   aliases: ["اسرق", "steal", "زرف", "نهب"],
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
            attemptzrf: 0,
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
      const random = Math.floor(Math.random() * 10000) + 1;
      const member = message.mentions.members.first();
      if (!member) return message.reply(`استخدام خاطئ \n> \`نهب @منشن#\``);
      if (member.id === message.author.id) return message.reply("**تبي تسرق نفسك يا اهبل ؟**");
      if (member.user.bot) return message.reply("البوت مطفر دور غيره");
      const getpro = db.get(`${member.id}.${message.guild.id}.protection`);
      if (getpro > Date.now()) {
         const remainings = humanizeDuration(getpro - Date.now());

         return message.reply(`الشخص عنده حماية لمدة\n \`${remainings}\``)
            .catch(console.error);
      }

      if (member.id === client.user.id) return message.reply("تبي تسرق البوت يا اهبل ؟");
      if (member.id === "555408669488185344") return message.reply("**ماتقدر تسرق عبود توكل بس**");
      const memberBanks = await bank.findOne({ userID: member.id });
      if (!memberBanks) {
         let profile = await bank.create({
            userID: member.user.id,
            money: 0,
            user: member.user.tag,
            GuildID: message.guild.id,
            accountage: message.createdTimestamp,
         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })

      }
      const usertemps = await bank.findOne({ userID: member.id });
      setTimeout(async () => await bank.findOneAndUpdate({ userID: member.id }, { $set: { attemptzrf: 0 } }), 300000);
      if (usertemps.attemptzrf > 0) return message.reply("الرجال انزرف من شوي تعال بعد خمس دقايق")
      
      if (usertemps.money < random) return message.reply("الرجال ماعنده فلوس");
      const authorBank = await bank.findOne({ userID: message.author.id });
      const Aresponse = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: random } });
      const Mresponse = await bank.findOneAndUpdate({ userID: member.id }, { $inc: { money: -random } });
      if (!Aresponse || !Mresponse) return message.reply("Something went wrong");

      let temps = await bank.findOneAndUpdate({ userID: message.mentions.members.first().id }, { $set: { attemptzrf: 1 } });
      setTimeout(async () => await bank.findOneAndUpdate({ userID: member.id }, { $set: { attemptzrf: 0 } }), 120000);

      cooldowns.set(message.author.id, Date.now() + 600000);
      setTimeout(() => cooldowns.delete(message.author.id), 600000);
      const msgt = message.reply(`> **ازبنننن سرقنا ${random.toLocaleString()} ريال**`);
      await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { totalsteal: random } });




   },
};
