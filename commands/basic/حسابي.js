const Discord = require("discord.js");
const bank = require("../../models/schema.js");
module.exports = {
   name: "حسابي",
   aliases: ["فلوس", "قروش", "قروشي", "money", "فلوسي", "حساب"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   cooldowns: 1000,
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
      const topusers = await bank.find({ userID: message.author.id }).sort({ money: -1 }).limit(10);

      if (!args[0]) {
         const authorBank = await bank.findOne({ userID: message.author.id });


         const embed = new Discord.MessageEmbed()
            .setTitle(`${message.guild.name} `)
            .setColor("RANDOM")
            .setTimestamp()
            .setThumbnail("https://cdn.discordapp.com/attachments/947898070845247529/968214987426365520/money-bag_1.png?size=4096")
            .setDescription(`مجموع فلوسك هو:\n**${authorBank.money.toLocaleString()}$** `)
            
            .setFooter({ text: `${message.guild.name} • By Abood#2000 `, iconURL: message.guild.iconURL() })
  
         message.reply({ embeds: [embed] });


      } else {
         const member = message.mentions.members.first();
         if (!member) return message.reply("منشن شخص موجود بالسيرفر!");
         const memberBank1 = await bank.findOne({ userID: member.id });
         if (!memberBank1) {
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
         const memberBank = await bank.findOne({ userID: member.id });

         let embed = new Discord.MessageEmbed()
            .setTitle(`${message.guild.name}`)
            .setColor("RANDOM")
            .setThumbnail("https://cdn.discordapp.com/attachments/947898070845247529/968214987426365520/money-bag_1.png?size=4096")
            .setTimestamp()
            .setDescription(`مجموع فلوس ${member} هو: \n**${memberBank.money.toLocaleString()}$**`)
            .setFooter({ text: `${message.guild.name} • By Abood#2000 `, iconURL: message.guild.iconURL() })
         message.reply({ embeds: [embed] })





      }




   },
};
