const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "قمار",
   aliases: ["p", "pong"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      const userBanks = await bank.findOne({ userID: message.author.id });
      if (!userBanks) {
         let profile = await bank.create({
            userID: message.author.id,
            money: 0,
            user: message.author.tag,
            GuildID: message.guild.id,
            accountage: message.createdTimestamp,
            attemptgmar: 0,
         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }
      const cooldown = cooldowns.get(message.author.id);
      if (cooldown) {
         const remaining = humanizeDuration(cooldown - Date.now());

         return message.reply(`:x: | **\`${remaining}\` , Please wait**`)
            .catch(console.error);
      }

      
      const userBank = await bank.findOne({ userID: message.author.id });
      if (userBank.money < 1000) return this.cooldown = 1000, message.reply("تحتاج 1000 ريال عشان تقامر");
      let inv = args[0]
      if (!inv) return this.cooldown = 1000, message.reply('اكتب المبلغ الي تبي تقامر فيه')
      if (isNaN(args[0])) return message.reply(`يرجى كتابة الامر بالطريقة الصحيحة \n> \`قمار المبلغ#\``);

      if (inv > userBank.money) return message.reply("اطلب الله مامعك المبلغ هذا");
      if (inv < 1000) return message.reply("ماتقدر تقامر بأقل من 1000 ريال");



      // const percentageDiffs = (A, B) => { return Math.floor((A * 100) / B) };
      // const perscent = percentageDiffs(value, inv);

      cooldowns.set(message.author.id, Date.now() + 300000);
      setTimeout(() => cooldowns.delete(message.author.id), 300000);

      let pick = [
         "lose",
         "win",
      ]

      let embed = new Discord.MessageEmbed()
         .setThumbnail("https://cdn.discordapp.com/attachments/947898070845247529/967517285277388820/jackpot-machine.png?size=4096")
         .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
         .setTitle("قمار 🎰")
         .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() })
      let value = pick[Math.floor(Math.random() * pick.length)]
      if (value === "win") {
         let win = Math.floor(inv * 2);
         let res = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: win } });
         if (!res) return message.reply('Something went wrong: contact the developer')
         const balance = await bank.findOne({ userID: message.author.id });
         const msgt = message.reply({
            embeds: [
               embed.setDescription(`__**فزت القمار !**__
قامرت بـ : ${inv.toLocaleString()} ريال وربحت ${win.toLocaleString()} !
رصيدك السابق 💸: \`${userBank.money.toLocaleString()}\`$
رصيدك الحالي 💸: \`${balance.money.toLocaleString()}\`$`)
                  .setColor("#35ba74")
            ]
         });


      }
      if (value === 'lose') {
         let res = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: -inv } });
         if (!res) return message.reply('Something went wrong: contact the developer')
         const balance = await bank.findOne({ userID: message.author.id });
         const msgt = message.reply({
            embeds: [
               embed.setDescription(`__**خسرت القمار**__
قامرت بـ : ${inv.toLocaleString()} ريال وخسرتهم !
رصيدك السابق 💸: \`${userBank.money.toLocaleString()}\`$
رصيدك الحالي 💸: \`${balance.money.toLocaleString()}\`$`)
                  .setColor("#3e0001")
            ]
         })
      }




   },
};
