const Discord = require("discord.js");
const store = require("../../models/store.js");
const bank = require("../../models/schema.js");

const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
let { MessageEmbed } = require('discord.js');
module.exports = {
   name: "add",
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
      if (!args[0]) return message.reply(`item name required`);
      const item = await store.findOne({ item: args[0] });
      if (item) return message.reply(`item name already exist`);
      
      if (!args[1]) return message.reply(`item price required`);

      if (!args[2]) return message.reply(`item id required`);
      const id = await store.findOne({ id: args[2] });
      if (id) return message.reply(`item id already exist`);

      const additems = await store.create({
         item: args[0],
         price: args[1],
         id: args[2],
         guild: message.guild.id,
      });
      additems.save()
         .catch(err => {
            return message.reply('Something went wrong')
         })
      message.reply(`item added`)

   },
};
