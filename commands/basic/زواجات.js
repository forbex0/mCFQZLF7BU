const Discord = require("discord.js");
const marry = require("../../models/marry.js");
const ms = require('ms')
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "زواجات",
   aliases: ["top"],
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
      const topusers = await marry.find({ GuildID: client.config.ToptestID }).sort({ mhr: -1 }).limit(10);

      let embed = new Discord.MessageEmbed()
         .setAuthor({ name: "اغلى 10 زواجات بالسيرفر 📋", iconURL: message.guild.iconURL() })
         .setColor("#FFFFFF")
         .setFooter({ text: `Developer: Abood#2000 `, iconURL: message.guild.iconURL() })
         
         .setTimestamp();
         
      let members = []
      let membersmoney = []
      for (let i = 0; i < topusers.length; i++) {
         members.push(`#${i + 1} | 🤵 <@${topusers[i].male}> & 👰 <@${topusers[i].female}> : \`${topusers[i].mhr.toLocaleString()}$\``)
      }
      if (members.length < 1) {
         members.push(`لا يوجد زواجات في هذا الخادم `)
      }

      embed.addField(`👰 & 🤵`, `${members.join("\n\n")}`, true)
      message.reply({ embeds: [embed] });
      cooldowns.set(message.author.id, Date.now() + 15000);
      setTimeout(() => cooldowns.delete(message.author.id), 15000);

   },

};
