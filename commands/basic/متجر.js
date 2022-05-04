const Discord = require("discord.js");
const store = require("../../models/store.js");
const bank = require("../../models/schema.js");
const bag = require("../../models/bag.js");

const ms = require("ms");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

let {MessageEmbed} = require('discord.js');
module.exports = {
   name: "متجر",
   aliases: ["store"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      const userStore = await bag.findOne({ userID: message.author.id });
      if (!userStore) {
         let profile = await bag.create({
            userID: message.author.id,
            hotel: 0,
            building: 0,
            apartment: 0,
            house: 0,
            villa: 0,
            club: 0,
            casino: 0,
            stadium: 0,
            bank: 0,
            protection: 0,
         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }
      const userBank = await bank.findOne({ userID: message.author.id });
      if (!userBank) {
         let profile = await bank.create({
            userID: message.author.id,
            money: 0,
            user: message.author.tag,
            GuildID: message.guild.id,

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
      const storeP = await store.findOne({ guild: message.guild.id });


      const topusers = await store.find().sort({ id: -1 }).limit(20);
      let embed = new MessageEmbed()
      .setColor(client.help.color)
      .setAuthor({name: "Available Items", iconURL: message.guild.iconURL()})
      for (let i = 0; i < topusers.length; i++) {
         let price = topusers[i].price;
         embed.addField(`${topusers[i].item} | ID: \`${topusers[i].id}\``, `السعر: $${parseInt(price).toLocaleString()}`,true)
         embed.setThumbnail("https://cdn.discordapp.com/attachments/947898070845247529/968210115360591942/skyscraper.png?size=4096")  
      }

      embed.addField('للتذكير',`__**الاسعار قابلة للتغيير في اي وقت**__`)
      message.channel.send({embeds: [embed]});
      




   },
};
