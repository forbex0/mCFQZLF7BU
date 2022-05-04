const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const ms = require("ms");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
const store = require("../../models/store.js");
const bag = require("../../models/bag.js");
const {
   MessageEmbed,
   MessageActionRow,
   MessageButton
} = require('discord.js')
const db = require("quick.db");

module.exports = {
   name: "مزاد",
   aliases: ["auction", "auctioneer", "auctioneer"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
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
         });
         profile.save()
            .catch(err => {
               return message.reply('Something went wrong')
            })
      }
      const userBanks = await bank.findOne({ userID: message.author.id });
      if (!userBanks) {
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
         // make remaining time human readable


         return message.reply(`:x: | **\`${remaining}\` , انتظر لاهنت**`)
            .catch(console.error);
      }
      if (!args[0]) return message.channel.send("يرجى تحديد العنصر المراد بيعه بستخدام الايدي\nمثال: **مزاد 1**")
      const userItems = await bag.findOne({ userID: message.author.id });
      const itemcheck = await store.findOne({ id: args[0] });
      if (!itemcheck) return message.reply("العنصر هذا غير متوفر");
      const finditemname = itemcheck.item
      let count = args[1] || 1;
      let totalprice = itemcheck.price * count;

      if (userItems[finditemname] < 1) return message.reply("انت لا تمتلك هذا العنصر !");
      cooldowns.set(message.author.id, Date.now() + 84000000);
      setTimeout(() => cooldowns.delete(message.author.id), 84000000);
      // await bag.findOneAndUpdate({ userID: message.author.id }, { $inc: { [`${finditemname}`]: -count}})
      let lastbider = await db.fetch(`auction`)
      let bids = await db.fetch(`bids.${lastbider}`)
      let row = new MessageActionRow()
         .addComponents(
            new MessageButton()
               .setLabel('بدء المزاد')
               .setStyle('DANGER')
               .setCustomId('start')
         )
      const embed = new MessageEmbed()
         .setTitle(`المزايدة على ${itemcheck.item}`)
         .setDescription(`لبدء المزاد اضغط على الزر الاسفل`)
         .setColor('#0099ff')
         .setTimestamp()
         .setThumbnail('https://i.imgur.com/ZdzCm0a.png')
      message.channel.send({
         embeds: [embed],
         components: [row],
      }).then(m => {
         const collector = message.channel.createMessageComponentCollector({
            time: 20000,
            componentType: "BUTTON",
         })


         collector.on("collect", async (interaction) => {
            let userBank = await bank.findOne({ userID: interaction.user.id });
            let row = new MessageActionRow()
               .addComponents(
                  new MessageButton()
                     .setLabel('5000$')
                     .setStyle('DANGER')
                     .setCustomId('bid5')
               )
               .addComponents(
                  new MessageButton()
                     .setLabel('50,000$')
                     .setStyle('DANGER')
                     .setCustomId('bid50')
               )
            if (interaction.customId === "start") {

               db.set(`auctionauthor`, message.author.id)
               if (interaction.user.id !== message.author.id) return interaction.reply({
                  content: "مالك دخل ياملقوف :)",
                  ephemeral: true
               })
               
               const dembed = new MessageEmbed()
                  .setDescription(`لقد بدأت المزايدة!\nالوقت المتبقي: 20 ثانية`)
                  .setColor('GREEN')
                  .setTitle(`المزايدة على ${itemcheck.item}`)
                  .setTimestamp()
                  .setThumbnail('https://i.imgur.com/ZdzCm0a.png')

               interaction.deferUpdate()
               m.edit({ embeds: [dembed], components: [row] });
               db.set(`auctionauthor`, `${message.author.id}`)

            }
            if (interaction.customId === "bid5") {
               if (interaction.user.id === message.author.id) {
                  interaction.reply({
                     content: "ماتقدر تزايد على املاكك !",
                     ephemeral: true,
                  });
               } else {
                  let biders = db.add(`bids`, 5000)
                  let totalbids = db.fetch(`bids`)
                  if (userBank.money < totalbids) return interaction.reply({
                     content: "فلوسك ماتكفي",
                     ephemeral: true,
                  }), db.add(`bids`, -5000)
                  if (userBank.money < 5000) return interaction.reply({
                     content: "انت لا تمتلك نقود كافية!",
                     ephemeral: true,
                  })

                  interaction.channel.send({ content: `قام ${interaction.user} بمزايدة 5,000$` })
                  db.set(`auction`, interaction.user.id)
                  interaction.deferUpdate()

               }


            }
            if (interaction.customId === "bid50") {
               if (interaction.user.id === message.author.id) {
                  interaction.reply({
                     content: "ماتقدر تزايد على املاكك !",
                     ephemeral: true,
                  });
               } else {
                  let biders = db.add(`bids`, 50000)
                  let totalbids = db.fetch(`bids`)
                  if (userBank.money < totalbids) return interaction.reply({ content: "فلوسك ماتكفي", ephemeral: true, }), db.add(`bids`, -50000)
                  if (userBank.money < 50000) return interaction.reply({
                     content: "انت لا تمتلك نقود كافية!",
                     ephemeral: true,
                  })
                  db.set(`auction`, interaction.user.id)

                  interaction.channel.send({ content: `قام ${interaction.user} بمزايدة 50,000$` })
                  interaction.deferUpdate()
               }

            }

         })

         collector.on("end", async (collected, reason) => {

            let row = new MessageActionRow()
               .addComponents(
                  new MessageButton()
                     .setLabel('Ended')
                     .setStyle('DANGER')
                     .setCustomId('none')
                     .setDisabled()
               )
            

            let lastbid = db.get(`auction`)
            let totalbids = db.get(`bids`)
            if (!lastbid && !totalbids) {
               const dembed = new MessageEmbed()
                  .setDescription(`انتهى المزاد بدون فائز !`)
                  .setColor('RED')
               setTimeout(() => {
                  message.channel.send({ embeds: [dembed] });
               }, 1500);
            } else {
               const finditemname = itemcheck.item
               let transfare = await bank.findOneAndUpdate({ userID: lastbid }, { $inc: { money: -totalbids } })
               let giveproprtey = await bag.findOneAndUpdate({ userID: lastbid }, { $inc: { [`${finditemname}`]: 1 } })
               let removeproprtey = await bag.findOneAndUpdate({ userID: message.author.id }, { $inc: { [`${finditemname}`]: -1 } })
               let transfar1e = await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: totalbids } })
               const dembed = new MessageEmbed()
                  .setDescription(`انتهى المزاد\nالفائز: <@${lastbid}>\nبمبلغ: ${totalbids}$\nعلى السلعة: ${itemcheck.item}\n من قبل: ${message.author}`)
                  .setThumbnail('https://i.imgur.com/0Hvmkhz.png')
                  .setColor('RED')
               setTimeout(() => {
                  message.channel.send({ embeds: [dembed] });
               }, 500);

            }

            if (reason === "time") {
               const dembed = new MessageEmbed()
                  .setDescription(`انتهى وقت المزاد`)
                  .setColor('RED')
               m.edit({ embeds: [dembed], components: [row] });
            }

            db.delete(`auctionauthor`)
            db.delete(`auction`)
            db.delete(`bids`)

         })
      })




   },
};
