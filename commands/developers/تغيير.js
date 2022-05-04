const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
const store = require("../../models/store.js");

module.exports = {
   name: "تغيير",
   aliases: ["اسرق", "steal", "زرف", "نهب"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      if (message.author.bot) return;

      let ids = [
         "555408669488185344",
         "671373182044864554",
      ]
      // make sure the user is a dev
      if (!ids.includes(message.author.id)) return;
      let allprices = await store.find();
      await allprices.forEach(async (item) => {
         let randomprice = Math.floor(Math.random() * 10000000) + 1;
      let randomprice1 = Math.floor(Math.random() * 1000000) + 1;
      let randomprice2 = Math.floor(Math.random() * 100000000) + 1;
      let randomprice3 = Math.floor(Math.random() * 800000) + 1;
      let randomprice4 = Math.floor(Math.random() * 90000000) + 1;
      let randomprice5 = Math.floor(Math.random() * 20000000) + 1;
      let randomprice6 = Math.floor(Math.random() * 3000000) + 1;
      let randomprice7 = Math.floor(Math.random() * 5000600) + 1;
      let randomprice8 = Math.floor(Math.random() * 10000000) + 1;
      
      let pickrandom = [
         randomprice,
         randomprice1,
         randomprice2,
         randomprice3,
         randomprice4,
         randomprice5,
         randomprice6,
         randomprice7,
         randomprice8,
      ]
      let random = pickrandom[Math.floor(Math.random() * pickrandom.length)]
         
         await store.findOneAndUpdate({ price: item.price }, {
            $set: {
               price: random,
            },
         });
      })
      let changeprices = new Discord.MessageEmbed()
         .setColor("#00ff00")
         .setTitle("**تغيير سعر المنتجات**")
         .setTimestamp();
      message.channel.send({embeds: [changeprices]});


   },
};
