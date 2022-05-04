const Discord = require("discord.js");
const { Collection } = require('discord.js')
const Timeout = new Collection();
const ms = require("ms");
module.exports = {
   name: "اوامر",
   aliases: ["help", "cmds", "commands"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
   //    if(Timeout.has(`${message.author.id}`)) return message.channel.send(`You are on a \`${ms(Timeout.get(`${message.author.id}`) - Date.now(), {long : true})}\` cooldown.`)
   //    Timeout.set(`${message.author.id}`, Date.now() + 10000)
   //    setTimeout(() => {
   //       Timeout.delete(`${message.author.id}`)
   //   }, 10000)
   let command = [
      "كرة",
      "مزاد",
      "زرف",
      "دين",
      "متجر",
      "شراء",
      "حقيبة",
      "تعدين",
      "استثمار",
      "قمار",
      "تداول",
      "لعبة",
      "مزاد",
      "توب",
      "راتب",
      "بخشيش",
      "حظ",
      "اليانصيب",
      "نقاط",
      "نرد",
      "زواج",
      "زواجي",
      "زواجات",
      "خلع",
      "طلاق",
      "حرامية",
      "حماية",

   ]
      const embed = new Discord.MessageEmbed()
      .setColor("WHITE")
      .setTitle("اوامر البوت")
      .setFooter({text: `${client.user.username} By Abood#2000`, iconURL: message.guild.iconURL()})
      .setThumbnail(client.user.displayAvatarURL({
         format: 'png',
         dynamic: true,
         size: 2048
      }))
      .setDescription(`**${command.join("\n")}**`)
            message.reply({embeds: [embed]});
   },
};
