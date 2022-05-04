const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const ms = require("ms");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "لعبه",
   aliases: ["لعبة", "حجر","rps"],
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
      cooldowns.set(message.author.id, Date.now() + 300000);
      setTimeout(() => cooldowns.delete(message.author.id), 300000);
      let embed = new Discord.MessageEmbed()
      .setTitle("حجرة ورقة مقص")
      .setDescription(`اضغط على الايموجي للعب!
> الجائزة : 5000 ريال`)
      .setColor(client.help.color)
      .setThumbnail('https://apprecs.org/gp/images/app-icons/300/4c/air.hl.RockPaperScissors.jpg')
      .setTimestamp()
      const componentsArray = [
         {
            type: 1,
            components: [
               {
                  type: 2,
                  style: 'SECONDARY',
                  customId: '🧱',
                  label: '🧱',
               },
               {
                  type: 2,
                  style: 'SECONDARY',
                  customId: '📰',
                  label: '📰',
               },
               {
                  type: 2,
                  style: 'SECONDARY',
                  customId: '✂',
                  label: '✂',
               },
            ],
         },
      ];
      let gameEnded = false;
      const msg = await message.reply({
         embeds:[embed],
         components: componentsArray,
      });

      const filter = button => {
         return button.user.id === message.author.id;
      };
      // get button id


      const button = await msg.createMessageComponentCollector({ filter: filter, componentType: 'BUTTON', max: 1 });
      const choices = ["🧱", "📰", "✂"];
      const me = choices[Math.floor(Math.random() * choices.length)]

      button.on('collect', async (bt) => {
         if ((me === "✂" && bt.customId === "🧱") ||
            (me === "📰" && bt.customId === "✂") ||
            (me === "🧱" && bt.customId === "📰")) {
            bt.deferUpdate();
            await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: 5000 } });
            await message.reply({
               embeds: [
                  embed = new Discord.MessageEmbed()
                     .setDescription(`> **مبروووووك فزت**`)
                     .setColor('GREEN')
                     .setAuthor({name:`${message.author.tag}`, url:'https://discord.gg/04',iconURL: message.author.displayAvatarURL()})
                     .addField(`انت اخترت`, `**\`${bt.customId}\`**`, true)
                     .addField(`انا اخترت`, `**\`${me}\`**`, true)
               ]
            });
            msg.delete()
            gameEnded = true;
         } else if (me === bt.customId) {
            bt.deferUpdate();
            await message.reply({
               embeds: [
                  embed = new Discord.MessageEmbed()
                     .setDescription(`> **تعادل**`)
                     .setAuthor({name:`${message.author.tag}`, url:'https://discord.gg/04',iconURL: message.author.displayAvatarURL()})
                     .setColor('ORANGE')
                     .addField(`انت اخترت`, `**\`${bt.customId}\`**`, true)
                     .addField(`انا اخترت`, `**\`${me}\`**`, true)
               ]
            });
            msg.delete()
            gameEnded = true;
         } else {
            bt.deferUpdate();
            await message.reply({
               embeds: [
                  embed = new Discord.MessageEmbed()
                     .setDescription(`> **للاسف خسرت**`)
                     .setColor('RED')
                     .setAuthor({name:`${message.author.tag}`, url:'https://discord.gg/04',iconURL: message.author.displayAvatarURL() })
                     .addField(`انت اخترت`, `**\`${bt.customId}\`**`, true)
                     .addField(`انا اخترت`, `**\`${me}\`**`, true)
               ]
            }); 
            msg.delete()
            gameEnded = true;
         }
      })

      setTimeout(() => {
         const mebed = new Discord.MessageEmbed()
         if (gameEnded == false) { message.reply({ embeds: [mebed.setDescription(`لديك لعبة مازالت بنتظارك, [اضغط هنا](${msg.url})`).setColor('RANDOM')] }).then(m => setTimeout(() => {
            m.delete()
         }, 7000)) }
      }, 7000);
      setTimeout(() => {
         if (gameEnded == false) { msg.delete() }
      }, 14000);

   },
};

