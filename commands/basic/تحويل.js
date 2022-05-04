const Discord = require("discord.js");
const bank = require("../../models/schema.js");
module.exports = {
   name: "تحويل",
   aliases: ["حول", "transfer"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   cooldowns: 50000,
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
         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }
      const member = message.mentions.members.first();
      if (!member) return message.reply(`يرجى كتابة الامر بالطريقة الصحيحة \n> \`تحويل @منشن المبلغ#\``);
      if (member.id === message.author.id) return message.reply("تبي تحول لنفسك ؟ اهبل انت؟");
      if (!args[1]) return message.reply(`يرجى كتابة الامر بالطريقة الصحيحة \n> \`تحويل @منشن المبلغ#\``);

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
      const authorBank = await bank.findOne({ userID: message.author.id });
      if (authorBank.money === 0) return message.reply("ما معك فلوس , حدك مصفر");
      if (authorBank.money < args[1]) return message.reply("فلوسك ماتكفي , المبلغ اكثر من قروشك");
      if (isNaN(args[1])) return message.reply("اكتب المبلغ بالارقام");
      if (args[1] < 5000) return message.reply("ماتقدر تحول اقل من 5000 ريال");
      const Aresponse = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: -args[1] } });
      const Mresponse = await bank.findOneAndUpdate({ userID: member.user.id }, { $inc: { money: args[1] } });
      if (!authorBank.lastDaily) { await bank.findOneAndUpdate({ userID: message.author.id }, { $set: { lastDaily: message.createdTimestamp } }) } else { await bank.findOneAndUpdate({ userID: message.author.id }, { $set: { lastDaily: message.createdTimestamp } }) }
      const embed = new Discord.MessageEmbed()
         .setColor("RANDOM")
         .setAuthor({name:`${message.author.tag}`,iconURL: message.author.displayAvatarURL()})
         .setTitle('عملية تحويل 💸')
         .setDescription(`\n من : ${message.author}\nحساب رقم: \`${message.author.id}\`\n الى : ${member}\nحساب رقم: \`${member.user.id}\`\n المبلغ : ${args[1]}$`)
         .setThumbnail("https://cdn.discordapp.com/attachments/947898070845247529/968218087709098037/investment.png?size=4096")
      message.reply({embeds: [embed]});



   },
};
