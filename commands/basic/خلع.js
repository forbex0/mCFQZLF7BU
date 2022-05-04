const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
const marry = require("../../models/marry.js");

module.exports = {
   name: "خلع",
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
      let female = await marry.findOne({ male: message.author.id }) || await marry.findOne({ female: message.author.id })
      if (!female) return message.reply("**تزوجي بعدين فكري تخلعي**")

      if (female.male === message.author.id) return message.reply(`**ماتقدر تخلع انت الزوج استخدم #طلاق**`)

      
      message.reply(`**تم اصدار صك خلع بناء على طلبكم\n\nالطرف الاول : <@${female.male}>\nالطرف الثاني: <@${female.female}>**`)
      await marry.deleteOne({female: message.author.id})
      cooldowns.set(message.author.id, Date.now() + 300000);
      setTimeout(() => cooldowns.delete(message.author.id), 300000);
   },
};
