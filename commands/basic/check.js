const Discord = require("discord.js");
const bank = require("../../models/schema.js");


module.exports = {
   name: "check",
   aliases: ["cc", "ck"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      let ids = client.config.ids

      if (!ids.includes(message.author.id)) return;
      const topusers = await bank.find({ GuildID: client.config.ToptestID }).sort({ money: -1 }).limit(1);
      if (topusers[0].money > 1000000000000) {
         message.reply(`${topusers[0].user} has arrived to the highest balance possible, type reset to reset all users money`)
      } else {
         message.reply(`None of the users have reached the highest balance possible`)
      }
      

   },
};
