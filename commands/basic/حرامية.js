const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const ms = require('ms')
const db = require('quick.db')
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "حرامية",
   aliases: ["سراقين", "سراق", "سروقي"],
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
            attemptinvs: 0,

         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }
      const topusers1 = await bank.find({ GuildID: client.config.ServerID }).sort({ totalsteal: -1 })
      const topusers = await bank.find({ GuildID: client.config.ServerID }).sort({ totalsteal: -1 }).limit(10);

      let embed = new Discord.MessageEmbed()
         .setAuthor({ name: "توب 10 حرامية بالسيرفر 📋", iconURL: message.guild.iconURL() })
         .setColor("#FFFFFF")
         .setFooter({ text: `Developer: Abood#2000 `, iconURL: message.guild.iconURL() })

         .setTimestamp();

      let members = []
      let membersmoney = []
      for (let i = 0; i < topusers.length; i++) {
         members.push(`#${i + 1} | <@${topusers[i].userID}> : \`${topusers[i].totalsteal === undefined ? 0 : topusers[i].totalsteal}\`$`)
      }
      if (members.length < 1) {
         members.push(`لا يوجد اعضاء `)
      }

      let pos = topusers1.findIndex(x => x.userID === message.author.id)
      let authorBank = await bank.findOne({ userID: message.author.id });
      embed.addField(`الاعضاء`, `${members.join("\n")}`, true)
      embed.addField(`ترتيبك في القائمة`, `__**${pos + 1}. ${message.author.tag}**__: **\`${authorBank.totalsteal === undefined ? 0 : authorBank.totalsteal}$\`**`)
      message.reply({ embeds: [embed] });


   },

};
