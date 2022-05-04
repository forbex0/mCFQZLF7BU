const Discord = require("discord.js");
const db = require("quick.db");
const { MessageButton } = require("discord.js");
const bag = require("../../models/bag.js");
const bank = require("../../models/schema.js");
const ms = require("ms");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "حماية",
   aliases: ["pp", "pr", "protection"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {

      const userbag = await bag.findOne({ userID: message.author.id });
      if (!userbag) {
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
      
      let useritems = await bag.findOne({ userID: message.author.id })
      if (!useritems.protection) return message.channel.send(`> انت لا تمتلك عنصر الحماية!\n> يمكنك الشراء عن طريق امر ${client.config.prefix}شراء 10`)
      if (useritems.protection < 1) return message.channel.send(`> انت لا تمتلك عنصر الحماية\n> يمكنك الشراء عن طريق امر ${client.config.prefix}شراء 10`)
      message.reply("تم تفعيل الحماية, لن يستطيع احد زرفك لمدة ساعة")
      await bag.findOneAndUpdate({ userID: message.author.id }, { $inc: { protection: -1 } })
      db.set(`${message.author.id}.${message.guild.id}.protection`, Date.now() + 3600000);
      setTimeout(() => {
         db.delete(`${message.author.id}.${message.guild.id}.protection`)
      }, 3600000);









   },
};
