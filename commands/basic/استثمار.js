const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "استثمار",
   aliases: ["استثمر"],
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
            attemptinvs: 0,

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
      const userBank = await bank.findOne({ userID: message.author.id });

      if (!args[0]) return message.reply("**:x: | اكتب المبلع الي تبي تستثمر فيه**")
      if (isNaN(args[0])) return message.reply(`يرجى كتابة الامر بالطريقة الصحيحة \n> \`استثمار المبلغ#\``);
      if (userBank.money < 1000) return message.reply("**تحتاج 1,000 ريال عشان تستثمر**");
      let inv = args[0]
      if (inv > userBank.money) return message.reply("**اطلب الله مامعك المبلغ هذا**");
      if (inv < 1000) return message.reply("**ماتقدر تستثمر بأقل من 1000 ريال**");
      const randomsss = Math.floor(inv - Math.random() * inv) + 1;
      const randomssss = Math.floor(inv - Math.random() * inv) + 1;
      const random = Math.floor(inv * 2) - Math.floor(Math.random() * 1000) + 1;
      const random1 = Math.floor(Math.floor(Math.random() * 10000) + parseInt(inv));
      const random2 = Math.floor(inv - Math.random() * inv) + 1;
      const random4 = Math.floor(inv / 3);
      const random5 = Math.floor(Math.random() * inv) + 1;
      const percentageDiff = (A, B) => { return Math.floor((A * 100) / B) };
      const random6 = percentageDiff(inv, 100.1);
      const random3 = Math.floor(inv * 2) - Math.floor(Math.random() * inv) + 1;
      const randoms = Math.floor(inv - Math.random() * inv) + 1;
      const randomss = Math.floor(inv - Math.random() * inv) + 1;

      cooldowns.set(message.author.id, Date.now() + 300000);
      setTimeout(() => cooldowns.delete(message.author.id), 300000);

      let pick = [
         random,
         random1,
         random2,
         random4,
         random,
         random5,
         random3,
         random,
         random6,
         random,

      ]
      let pick2 = [
         randomssss,
         randomsss,
         randomss,
         randoms,
         random,
         random1,
         randomsss,
         random2,
         random4,
         random5,
         random3,
         random6,
         random,
      ]
      let userbal = await bank.findOne({ userID: message.author.id });
      if (userbal.money > 100000000) {
         let value = pick2[Math.floor(Math.random() * pick2.length)]
         let embed = new Discord.MessageEmbed()
            .setThumbnail(message.author.avatarURL())
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
            .setTitle("استثمار 📈")
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() })
         if (value > inv) {

            let res = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: value } });
            if (!res) return message.reply('Something went wrong: contact the developer')
            const balance = await bank.findOne({ userID: message.author.id });
            const msgt = message.reply({
               embeds: [
                  embed.setDescription(`__**استثمار ناجح**__
   \nالارباح: ${value.toLocaleString()}$\nرصيدك السابق: ${userBank.money.toLocaleString()}$\nرصيدك الحالي: ${balance.money.toLocaleString()}$`).setThumbnail('https://cdn.discordapp.com/attachments/947898070845247529/961013943604764722/increase.png?size=4096').setColor('#35ba74')
               ]
            })
            await bank.findOneAndUpdate({ userID: message.author.id }, { $set: { attemptinvs: message.createdTimestamp } })
            await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { attemptinvs: 300000 } })
         }
         if (value < inv) {

            let res = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: -value } });
            if (!res) return message.reply('Something went wrong: contact the developer')
            const balance = await bank.findOne({ userID: message.author.id });
            const msgt = message.reply({
               embeds: [
                  embed.setDescription(`__**استثمار فاشل**__
    مجموع الخسائر: ${value.toLocaleString()}$\nرصيدك السابق: ${userBank.money.toLocaleString()}$\nرصيدك الحالي: ${balance.money.toLocaleString()}$`).setThumbnail("https://cdn.discordapp.com/attachments/947898070845247529/961013943277604934/decrease_2.png?size=4096").setColor('#3e0001')
               ]
            })

         }
      } else {
         let value = pick[Math.floor(Math.random() * pick.length)]
         let embed = new Discord.MessageEmbed()
            .setThumbnail(message.author.avatarURL())
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
            .setTitle("استثمار 📈")
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() })
         if (value > inv) {

            let res = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: value } });
            if (!res) return message.reply('Something went wrong: contact the developer')
            const balance = await bank.findOne({ userID: message.author.id });
            const msgt = message.reply({
               embeds: [
                  embed.setDescription(`__**استثمار ناجح**__
\nالارباح: ${value.toLocaleString()}$\nرصيدك السابق: ${userBank.money.toLocaleString()}$\nرصيدك الحالي: ${balance.money.toLocaleString()}$`).setThumbnail('https://cdn.discordapp.com/attachments/947898070845247529/961013943604764722/increase.png?size=4096').setColor('#35ba74')
               ]
            })
            await bank.findOneAndUpdate({ userID: message.author.id }, { $set: { attemptinvs: message.createdTimestamp } })
            await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { attemptinvs: 300000 } })
         }
         if (value < inv) {

            let res = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: -value } });
            if (!res) return message.reply('Something went wrong: contact the developer')
            const balance = await bank.findOne({ userID: message.author.id });
            const msgt = message.reply({
               embeds: [
                  embed.setDescription(`__**استثمار فاشل**__
 مجموع الخسائر: ${value.toLocaleString()}$\nرصيدك السابق: ${userBank.money.toLocaleString()}$\nرصيدك الحالي: ${balance.money.toLocaleString()}$`).setThumbnail("https://cdn.discordapp.com/attachments/947898070845247529/961013943277604934/decrease_2.png?size=4096").setColor('#3e0001')
               ]
            })

         }
      }
   },

};
