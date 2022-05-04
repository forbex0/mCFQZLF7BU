const Discord = require("discord.js");
const bank = require("../../models/schema.js");

const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
let { MessageEmbed } = require('discord.js');
module.exports = {
   name: "rm",
   aliases: [""],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      let ids = client.config.ids
      // make sure the user is a dev
      if (!ids.includes(message.author.id)) return;
      if (!args[1]) {
         const memberID = message.author.id
         const member = await bank.findOne({ userID: memberID })
         if (!member) return message.reply(`You don't have bank account`)
         if (args[0] > member.money) return await bank.findOneAndUpdate({ userID: message.author.id }, { $set: { money: 0 } }), message.reply(`You have reseted your money`)
         await bank.findOneAndUpdate({ userID: memberID }, { $inc: { money: -args[0] } })
         message.reply(`You have removed ${args[0]}$ from your account`)
      } else {
         let member = message.mentions.members.first();
         if (!member) return message.reply(`Mention a vaild user`);
         if (!args[1]) return message.reply(`enter money amount`);
         if (isNaN(args[1])) return message.reply(`enter a vaild amount in numbers`);

         const money = await bank.findOne({ userID: member.id });
         if (!money) {
            const newmoney = await bank.create({
               userID: member.id,
               money: args[1],
               GuildID: message.guild.id,
            });
            newmoney.save()
               .catch(err => {
                  return message.reply('Something went wrong')
               })
         }
         const membermoney = await bank.findOne({ userID: message.mentions.members.first().id });
         if (args[1] > membermoney.money) return await bank.findOneAndUpdate({ userID: message.mentions.members.first().id }, { $set: { money: 0 } }), message.reply(`You have reset ${member.user.tag} money`)
         await bank.findOneAndUpdate({ userID: message.mentions.members.first().id }, { $inc: { money: -args[1] } })
         message.reply(`You have removed ${args[1]}$ from ${member.user.tag}`)
      }



   },
};
