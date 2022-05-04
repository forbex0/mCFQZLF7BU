const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
const marry = require("../../models/marry.js");

module.exports = {
   name: "طلاق",
   aliases: [""],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      const cooldown = cooldowns.get(message.author.id);
      if (cooldown) {
         const remaining = humanizeDuration(cooldown - Date.now());

         return message.reply(`:x: | **\`${remaining}\` , انتظر لاهنت**`)
            .catch(console.error);
      }
      let male = await marry.findOne({ male: message.author.id }) || await marry.findOne({ female: message.author.id })
      if (!male) return message.reply("**تزوجي بعدين فكري تطلقي**")

      if (male.female === message.author.id) return message.reply(`**ماتقدرين تطلقي انتي الزوجة استخدمي #خلع**`)

      
      message.reply(`**تم اصدار صك طلاق بناء على طلبكم\n\nالطرف الاول : <@${male.male}>\nالطرف الثاني: <@${male.female}>**`)
      await marry.deleteOne({male: message.author.id})
      cooldowns.set(message.author.id, Date.now() + 300000);
      setTimeout(() => cooldowns.delete(message.author.id), 300000);
   },
};
