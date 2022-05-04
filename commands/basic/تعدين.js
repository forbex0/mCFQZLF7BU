const Discord = require("discord.js");
const db = require("quick.db");
const { MessageButton } = require("discord.js");
const bag = require("../../models/bag.js");
const bank = require("../../models/schema.js");
const ms = require("ms");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "تعدين",
   aliases: ["mi", "mine"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {

      // const percentageDiff = (A, B) => { return Math.floor((A * 100) / B) };

      // message.channel.send(`${percentageDiff(500,2000)}%`);
      const userbag = await bag.findOne({ userID: message.author.id });
      if (!userbag) {
         let profile = await bag.create({
            userID: message.author.id,
            hotel: 0,
            building: 0,
            apartment: 0,
            house: 0,
            villa: 0,
            club: 0,
            casino: 0,
            stadium: 0,
            bank: 0,
            mining: 0,
         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }
      const cooldown = db.get(`${message.author.id}.date`);
      if (cooldown > Date.now()) {
         const remaining = humanizeDuration(cooldown - Date.now());

         return message.reply(`:x: | **\`${remaining}\` , انتظر لاهنت**`)
            .catch(console.error);
      }
      let useritems = await bag.findOne({ userID: message.author.id })
      if (!useritems.mining) {
         await bag.findOneAndUpdate({ userID: message.author.id }, { $set: { mining: 0 } })

      }
      if (!useritems.mining) return message.channel.send(`> انت لا تمتلك عنصر التعدين!\n> يمكنك الشراء عن طريق امر ${client.config.prefix}شراء 7`)
      if (useritems.mining < 0) return message.channel.send(`> انت لا تمتلك عنصر التعدين\n> يمكنك الشراء عن طريق امر ${client.config.prefix}شراء 7`)


      // const userattempts = db.fetch(`${message.author.id}.mining`)
      // if (userattempts > 2) return message.channel.send("> You have reached the maximum amount of attempts!")
      // db.set(`${message.author.id}.ismining`, 'on')
      db.set(`${message.author.id}.totalmining`, 0);
      let logchannel = message.guild.channels.cache.get(client.config.miningch)
      await bag.findOneAndUpdate({ userID: message.author.id }, { $inc: { mining: -1 } })
      for (i = 0; i < 12; i++) {
         setTimeout(async function () {
            db.add(`${message.author.id}.totalmining`, 1)
            const salary = Math.floor(Math.random() * (50000 - 50000) + 50000);
            const salary2 = Math.floor(Math.random() * (70000 - 50000) + 50000);
            const salary3 = Math.floor(Math.random() * (80000 - 50000) + 50000);
            const salary4 = Math.floor(Math.random() * (90000 - 50000) + 50000);
            let random = [salary, salary2, salary3, salary4];
            let random2 = random[Math.floor(Math.random() * random.length)]

            let embed = new Discord.MessageEmbed()
               .setColor('#2f3136')
            message.react('🔨')
            let totalmining = db.fetch(`${message.author.id}.totalmining`)
            logchannel.send({ content: `${message.author}`, embeds: [embed.setDescription(`> 💸 | **$${random2.toLocaleString()}**, العائد من التعدين\n> عملية رقم:  ${totalmining}`)] })
            logchannel.send('https://i.imgur.com/i7IGrvC.png')
            db.add(`${message.author.id}.mining`, 1)
            await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: random2 } })
            if (db.fetch(`${message.author.id}.totalmining`) == 12) {
               message.channel.send(`> لقد انتهت عمليات التعدين لديك, ${message.author}`)
            }
         }, i * 3600000);


         db.set(`${message.author.id}.date`, Date.now() + 43200000);
         setTimeout(() => {
            db.set(`${message.author.id}.date`, 0),
            db.set(`${message.author.id}.totalmining`, 0)
         }, 43200000);
      }








   },
};
