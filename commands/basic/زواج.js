const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
const marry = require("../../models/marry.js");
const { MessageEmbed } = require('discord.js');
module.exports = {
   name: "زواج",
   aliases: [""],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      const cooldown = cooldowns.get(message.author.id);
      if (cooldown) {
         const remaining = humanizeDuration(cooldown - Date.now());

         return message.reply(`:x: | **\`${remaining}\` , انتظر لاهنت**`)
            .catch(console.error);
      }
      let userbank = await bank.findOne({ userID: message.author.id })
      if (!userbank) {
         let profile = await bank.create({
            userID: message.author.id,
            money: 0,
            GuildID: message.guild.id,

         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }
      let checkuser = await marry.findOne({ male: message.author.id }) || await marry.findOne({ female: message.author.id })
      if (checkuser) {
         if (checkuser.male === message.author.id) return message.reply(`الحقي زوجك بياخذ الثانية, <@${checkuser.female}>`)
         if (checkuser.female) return message.reply(`الحق زوجتك تبي الثاني, <@${checkuser.male}>`)
      }
      
      let member = message.mentions.members.first()
      if (!member) return message.reply(`استخدام خاطئ\n#زواج @منشن المهر`)
      let useralreadymarried = await marry.findOne({ male: member.id })
      if (useralreadymarried) return message.reply(`**العضو متزوج**`)
      let feuseralreadymarried = await marry.findOne({ female: member.id })
      if (feuseralreadymarried) return message.reply(`**العضو متزوج**`)

      let memberBanks = await bank.findOne({ userID: member.id })
      if (!memberBanks) {
         let profile = await bank.create({
            userID: member.id,
            money: 0,
            GuildID: message.guild.id,

         });

         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }

      if (member.id === message.author.id) return message.reply("**😂😂😂 تبي تتزوج نفسك ؟**")
      if (member.user.bot) return message.reply("**😂😂😂 تبي تتزوج بوت ؟**")
      let emale = await marry.findOne({ male: message.author.id }) || await marry.findOne({ female: message.author.id })
      if (!emale) {
         if (!args[1]) return message.reply(`استخدام خاطئ\n#زواج @منشن المهر`)
         if (isNaN(args[1])) return message.reply(`استخدام خاطئ\n#زواج @منشن المهر`)
         let userbank = await bank.findOne({ userID: message.author.id })
         if (userbank.money < args[1]) return message.reply("**فلوس ماتكفي اطلب الله**")
         if (args[1] < 50000) return message.reply("**ماعندنا زواجات تحت 50000 الف**")
         let currentYear = new Date().getFullYear();
         let currentMonth = new Date().getMonth();
         let currentDay = new Date().getDate();
         let fulldate = `${currentYear}-${currentMonth}-${currentDay}`
         let profile = await marry.create({
            mhr: args[1],
            male: message.author.id,
            female: member.id,
            date: fulldate

         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
         await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: -args[1] } })
         await bank.findOneAndUpdate({ userID: member.id }, { $inc: { money: args[1] } })
         let embed = new MessageEmbed()
            .setColor("WHITE")
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL })
            .setThumbnail("https://cdn.discordapp.com/attachments/947898070845247529/968577744403324978/wedding-couple_1.png?size=4096")
            .setDescription(`كولولولولوششش\n
تم اليوم عقد قران كل من:\n🤵 ${message.author} & 👰 ${member}\n على المهر المتفق عليه **${args[1]}$**\n لعرض وثيقة زواجكم: #زواجي`)
         message.reply({ embeds: [embed] })
         cooldowns.set(message.author.id, Date.now() + 300000);
         setTimeout(() => cooldowns.delete(message.author.id), 300000);
      } else {
         if (emale.male === member.id) return message.reply("الرجال متزوج استحي على دمك!")
         if (emale.female === member.id) return message.reply("عيب عليك بنت عالم وناس مملكة شوف غيرها")
      }



   },
};
