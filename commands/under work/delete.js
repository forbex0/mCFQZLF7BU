const Discord = require("discord.js");
const store = require("../../models/store.js");
const bank = require("../../models/schema.js");

const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
let { MessageEmbed } = require('discord.js');
module.exports = {
   name: "delete",
   aliases: ["اسرق", "steal", "زرف", "نهب"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      
      let ids = [
         "555408669488185344",
         "671373182044864554",
      ]
      // make sure the user is a dev
      if (!ids.includes(message.author.id)) return;
      if (!args[0]) return message.reply(`item id required`);
      const id = await store.findOne({ id: args[0] });
      if (!id) return message.reply(`item id doesn't exist`);

      const additems = await store.deleteOne({
         id: args[0],
      });
      message.reply(`item removed`)

   },
};
