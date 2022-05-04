const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const ms = require('ms')
const db = require('quick.db')
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "توب",
   aliases: ["top"],
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
      const topusers1 = await bank.find({ GuildID: client.config.ServerID }).sort({ money: -1 })
      const topusers = await bank.find({ GuildID: client.config.ServerID }).sort({ money: -1 }).limit(10);

      let embed = new Discord.MessageEmbed()
         .setAuthor({ name: "اغنى 10 اعضاء بالسيرفر 📋", iconURL: message.guild.iconURL() })
         .setColor("#FFFFFF")
         .setFooter({ text: `Developer: Abood#2000 `, iconURL: message.guild.iconURL() })
         
         .setTimestamp();
         
      let members = []
      let membersmoney = []
      for (let i = 0; i < topusers.length; i++) {
         members.push(`#${i + 1} | <@${topusers[i].userID}> : \`${topusers[i].money.toLocaleString()}$\``)
      }
      if (members.length < 1) {
         members.push(`لا يوجد اعضاء `)
      }

      let pos = topusers1.findIndex(x => x.userID === message.author.id)
      let authorBank = await bank.findOne({ userID: message.author.id });
      embed.addField(`الاعضاء`, `${members.join("\n")}`, true)
      embed.addField(`ترتيبك في القائمة`, `__**${pos + 1}. ${message.author.tag}**__: **\`${authorBank.money}$\`**`)
      embed.addField('__**للتذكير**__',`في حال وصول عضو الى مبلغ 1,000,000,000,000 راح تتصفر الفلوس`)
      message.reply({ embeds: [embed] });


   },

};
