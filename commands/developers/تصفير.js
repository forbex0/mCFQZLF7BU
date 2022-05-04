const Discord = require("discord.js");
const store = require("../../models/store.js");
const bank = require("../../models/schema.js");
const marry = require("../../models/marry.js");

const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
let { MessageEmbed } = require('discord.js');
module.exports = {
   name: "تصفير",
   aliases: [""],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      let ids = client.config.ids
      if (!ids.includes(message.author.id)) return;
      const topusers = await bank.find({ GuildID: client.config.ServerID }).sort({ money: -1 }).limit(1);
      if (topusers[0].money > 1000000000000) {
         message.reply(`<@${topusers[0].userID}> has arrived to the highest balance possible, :first_place: **1st** point added to the user`)
         await bank.findOneAndUpdate({ user: topusers[0].userID }, { $inc: { points: 1 } })
      } else {
         message.reply(`None of the users have reached the highest balance possible to get the :first_place: 1st point , but everything has been reseted :white_check_mark:`)
      }
      
      await bank.updateMany({}, {
         $set: {
            money: 0,
         },
      }
      );
      const allData = await marry.find({});
      if (allData.length < 1) return message.reply("No data found!");
      await marry.collection.drop();

      await bank.updateMany({}, {
         $set: {
            totalsteal: 0,
         },
      }
      );



   },
};
