const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const bank = require("../../models/schema.js");
const ms = require("ms");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "حظ",
   aliases: [""],
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
            luck: 0,
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
      cooldowns.set(message.author.id, Date.now() + 300000);
      setTimeout(() => cooldowns.delete(message.author.id), 300000);
         let random = [
            "19999",
            "1",
            "500",
            "100",
            "100",
            "10",
            "200000",
            "1",
            "500",
            "9999999",
            "1000",
            "100",
            "9999",
            "500",
            "250",
            "19999",
            "1",
            "500",
            "25",
            "500",
            "100",
            "345",
            "25",
            "100000",
            "10",
            "25",
            "250",
         ]
         let value = random[Math.floor(Math.random() * random.length)]
         message.reply({embeds:[
            embed = new Discord.MessageEmbed()
            .setDescription(`يلا عطيتك **$${value}** اجحدها !`).setColor("RANDOM")
         ]})
         let res = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: value } });
         if (!res) return message.reply('Something went wrong: contact the developer')
         
   },
};
