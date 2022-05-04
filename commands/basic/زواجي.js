const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
const marry = require("../../models/marry.js");
const { MessageEmbed } = require('discord.js');
module.exports = {
   name: "زواجي",
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
      let male = await marry.findOne({ male: message.author.id }) || await marry.findOne({ female: message.author.id })
      if (!male) return message.reply("**الله يزوجك**")

      let embed = new MessageEmbed()
      .setAuthor({name:"عقد زواج",iconURL:"https://cdn.discordapp.com/attachments/947898070845247529/968578992544313394/wedding-ring.png?size=4096"})
         .setThumbnail("https://cdn.discordapp.com/attachments/947898070845247529/968577744055177257/wedding-couple.png?size=4096")
         .setColor("WHITE")
         .setDescription(`**🤵 <@${male.male}> | 👰 <@${male.female}>\nالمهر: **${male.mhr}$**\n\nتم الزواج في تاريخ : \`${male.date}\`**`)
      message.reply({ embeds: [embed] })
      cooldowns.set(message.author.id, Date.now() + 300000);
      setTimeout(() => cooldowns.delete(message.author.id), 300000);
   },
};
