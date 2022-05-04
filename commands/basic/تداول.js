const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "تداول",
   aliases: ["invs"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   cooldowns: 1000,
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
            attempttrade: 0,

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

      if (!args[0]) return message.reply("**:x: | اكتب المبلغ الي تبي تتداول فيه**")
      if (userBank.money < 1000) return message.reply("تحتاج 1000 ريال عشان تستثمر");
      let inv = args[0]
      if (inv > userBank.money) return message.reply("اطلب الله مامعك المبلغ هذا");
      if (inv < 1000) return message.reply("ماتقدر تستثمر بأقل من 1000 ريال");
      cooldowns.set(message.author.id, Date.now() + 300000);
      setTimeout(() => cooldowns.delete(message.author.id), 300000);
      let randomRate = Math.floor(Math.random() * 100) + 1;

      var percentToGet = randomRate;

      var percent = (percentToGet / 100) * inv;

      let winorlose = [
         "win",
         "lose"
      ]
      let randompick = winorlose[Math.floor(Math.random() * winorlose.length)];

      let brands = [
         "تيسلا",
         "ابل",
         "شاومي",
         "دسكورد",
         "امازون",
         "مايكروسوفت",
         "هايبر اكس",
         "سامسونق",
         "صينية",
         "تشل زون",
         "هيد اند شولدرز",
      ]


      let embed = new Discord.MessageEmbed()
         .setThumbnail("https://cdn-icons-png.flaticon.com/512/4221/4221633.png")
         .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
         .setTitle("تداول ⚖️")
         .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() })

      if (randompick == "win") {
         let value = percent.toFixed()
         await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: value } });
         // console.log("You won the deal " + percentToGet + "% of " + inv + " is " + percent.toFixed());
         const balance = await bank.findOne({ userID: message.author.id });
         let msgt = message.reply({
            embeds: [
               embed.setDescription(`__**تداول ناجح بنسبة ${percentToGet}%**__
تداولت في شركة ${brands[Math.floor(Math.random() * brands.length)]}
تداولت بقيمة ${inv.toLocaleString()} ريال
الارباح: ${value.toLocaleString()} ريال
رصيدك الحالي: ${balance.money.toLocaleString()} ريال
رصيدك السابق: ${userBank.money.toLocaleString()} ريال`).setColor("#35ba74").setThumbnail('https://cdn-icons-png.flaticon.com/512/4221/4221633.png')

            ]
         })
      }
      if (randompick == "lose") {
         let value = percent.toFixed()
         await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: -value } });
         const balance = await bank.findOne({ userID: message.author.id });
         let msgt = message.reply({
            embeds: [
               embed.setDescription(`__**خسرت التداول**__
تداولت في شركة ${brands[Math.floor(Math.random() * brands.length)]}
تداولت بقيمة ${inv.toLocaleString()} ريال
خسرت: ${value.toLocaleString()} ريال 
الرصيد الحالي: ${balance.money.toLocaleString()} ريال
رصيدك السابق: ${userBank.money.toLocaleString()} ريال`).setColor("#3e0001").setThumbnail('https://cdn-icons-png.flaticon.com/512/4221/4221653.png')

            ]
         })
      }




   },
};
