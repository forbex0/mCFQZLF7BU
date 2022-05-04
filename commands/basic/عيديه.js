const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const db = require("quick.db");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "عيديه",
   aliases: ["tip","عيد","عيديتي","عيدني"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {

      const userBank = await bank.findOne({ userID: message.author.id });
      if (!userBank) {
         let profile = await bank.create({
            userID: message.author.id,
            money: 0,
            user: message.author.tag,
            GuildID: message.guild.id,
            accountage: message.createdTimestamp,
            attempttip: 0,
         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }
      const cooldown = cooldowns.get(message.author.id);
      if (cooldown) {
         const remaining = humanizeDuration(cooldown - Date.now());

         return message.reply(`> :x: | **\`${remaining}\` , توني معطيك عيديه تعال بعد**`)
            .catch(console.error);
      }
      cooldowns.set(message.author.id, Date.now() + 240000);
      setTimeout(() => cooldowns.delete(message.author.id), 240000);

      const random = Math.floor(Math.random() * 999) + 1;


      let res = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: random } });
      if (!res) return message.reply('Something went wrong: contact the developer')
      const msgt = message.reply(`> من العايدين والفايزين , هاك عيدتك **\`${random}\`**`);



   },
};
