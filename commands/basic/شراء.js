const Discord = require("discord.js");
const store = require("../../models/store.js");
const ms = require("ms");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
const bank = require("../../models/schema.js");
const bag = require("../../models/bag.js");

module.exports = {
   name: "شراء",
   aliases: ["buy"],
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
            protection: 0,
            house: 0,
            villa: 0,
            club: 0,
            casino: 0,
            stadium: 0,
            bank: 0,
            
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
      if (!args[0]) return message.reply("يرجى تحديد العنصر المراد شرائه\nمثال: #شراء 1")
      const user = await bank.findOne({ userID: message.author.id });
      const itemcheck = await store.findOne({ id: args[0] });
      // const useritems = await store.findOne({ userID: message.author.id });
      if (itemcheck) {
         let count = args[1] || 1;
         let totalprice = itemcheck.price * count;
         if (user.money < totalprice) return message.channel.send("لا تمتلك النقود الكافية!");
         const finditemname = itemcheck.item
         await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: -totalprice } });
         await bag.findOneAndUpdate({ userID: message.author.id }, { $inc: { [`${finditemname}`]: count } })
         message.reply(`تم شراء **${count}** ${itemcheck.item} بمبلغ ${totalprice.toLocaleString()}$`);
         cooldowns.set(message.author.id, Date.now() + 10000);
         setTimeout(() => cooldowns.delete(message.author.id), 10000);
      } else {
         message.reply("العنصر هذا غير متوفر!")
      }

   },
};
