const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
const store = require("../../models/store.js");

module.exports = {
   name: "بيع",
   aliases: ["sell"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: true,
   run: async (client, message, args) => {
      const userBank = await bank.findOne({ userID: message.author.id });
      if (!userBank) {
         let profile = await bank.create({
            userID: message.author.id,
            money: 0,
            user: message.author.tag,
            GuildID: message.guild.id,
            accountage: message.createdTimestamp,
            attemptzrf: 0,
         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }


      if (!args[0]) return message.reply("Please specify an item to sell!")
      if (isNaN(args[0])) return message.reply("Please specify an item by id to sell!")

      const user = await store.findOne({ userID: message.author.id });
      const itemcheck = await store.findOne({ id: args[0] });
      const finditemname = itemcheck.item
      let count = args[1] || 1;
      let totalprice = itemcheck.price * count;
      if (user[finditemname] < 1) return message.reply("You don't have this item!");
      message.reply(`You sold **${count}** ${itemcheck.item} for ${totalprice.toLocaleString()}$`);
      await store.findOneAndUpdate({ userID: message.author.id }, { $inc: { [`${finditemname}`]: -count}})
      await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: totalprice } });

      

   },
};
