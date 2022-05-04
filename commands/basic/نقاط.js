const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const ms = require('ms')
const db = require('quick.db')
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "نقاط",
   aliases: ["points", "pts"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      const topusers1 = await bank.find({ GuildID: client.config.ToptestID }).sort({ points: -1 })
      const topusers = await bank.find({ GuildID: client.config.ToptestID }).sort({ points: -1 }).limit(10);

      let embed = new Discord.MessageEmbed()
         .setAuthor({ name: "اعلى 10 اشخاص بالنقاط 📋", iconURL: message.guild.iconURL() })
         .setColor("#FFFFFF")
         .setFooter({ text: `Developer: Abood#2000 `, iconURL: message.guild.iconURL() })
         
         .setTimestamp();
         
      let members = []
      let memberspoints = []
      for (let i = 0; i < topusers.length; i++) { 
         members.push(`#${i + 1} | <@${topusers[i].userID}> : \`${topusers[i].points === undefined ? 0 : topusers[i].points}\` <:point:968093881197531196>`)
      }
      if (members.length < 1) {
         members.push(`لا يوجد اعضاء `)
      }

      let pos = topusers1.findIndex(x => x.userID === message.author.id)
      let authorBank = await bank.findOne({ userID: message.author.id });
      embed.addField(`الاعضاء`, `${members.join("\n")}`, true)
      embed.addField(`ترتيبك في القائمة`, `__**${pos + 1}. ${message.author.tag}**__: **\`${authorBank.points === undefined ? 0 : authorBank.points}\` <:point:968093881197531196>**`)
      message.reply({ embeds: [embed] });


   },

};
