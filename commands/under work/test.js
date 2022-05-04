const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const bank = require("../../models/schema.js");
const ms = require("ms");
const talkedRecently = new Set();
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "test",
   aliases: ["football", "ftb"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      // get user id from reply message
      let userID = message.mentions.users.first()
      if (!userID) return message.reply("Please mention a user!");
      message.reply(userID.id);


   },
};
