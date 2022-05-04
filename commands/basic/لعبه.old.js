const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const bank = require("../../models/schema.js");
const ms = require("ms");
const talkedRecently = new Set();
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: ".oldلعبه",
   aliases: ["لعبة", "rps", "حجر"],
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
                  attempt: 0,
               });
               profile.save()
                  .catch(err => {
                     return message.reply('Something went wrong')
                  })
            }
            const userBank = await bank.findOne({ userID: message.author.id });

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
               .setDescription(`يرجى الانتظار لحين تجهيز اللعبة
      > الجائزة : 5 ريال`)
               .setColor(client.help.color)
               .setThumbnail('https://apprecs.org/gp/images/app-icons/300/4c/air.hl.RockPaperScissors.jpg')
               .setTimestamp()
            let msg = await message.reply({ embeds: [embed] })
            await msg.react("🧱").catch(c => console.log("Error 1"))
            await msg.react("📰").catch(c => console.log("Error 2"))
            await msg.react("✂").catch(c => console.log("Error 3"))
            await msg.edit({
               embeds: [embed.setDescription(`اضغط على الايموجي للعب!
      > الجائزة : 5,000 ريال`)]
            }).catch(c => console.log("Error"))

           
            

            client.on('messageReactionAdd', async (reaction, user) => {
               if (user.bot) return;
               if (user.id !== message.author.id) return;
               if (reaction.message.id !== msg.id) return;
               const choices = ["🧱", "📰", "✂"];
               const me = choices[Math.floor(Math.random() * choices.length)]

               if ((me === "🧱" && reaction.emoji.name === "✂") ||
                  (me === "✂" && reaction.emoji.name === "📰") ||
                  (me === "📰" && reaction.emoji.name === "🧱")) {

                  msg.edit({
                     embeds: [embed.setDescription(`للاسف خسرت`).addField("انت اخترت: ", `${reaction.emoji.name}`, true).addField("انا اخترت: ", `${me}`, true)]
                  }).catch(err => {
                     console.log('Something went wrong')
                  })
                  reaction.message.reactions.removeAll().catch(err => {
                     console.log('Something went wrong')
                  })

               } else if (me === reaction.emoji.name) {
                  msg.edit({
                     embeds: [embed.setDescription(`تعادل, حاول المرة القادمة`).addField("انت اخترت: ", `${reaction.emoji.name}`, true).addField("انا اخترت: ", `${me}`, true)]
                  }).catch(err => {
                     console.log('Something went wrong')
                  })
                  reaction.message.reactions.removeAll().catch(err => {
                     console.log('Something went wrong')
                  })

               } else {
                  await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: '5000' } })
                  msg.edit({
                     embeds: [embed.setDescription(`مبروووووك فزت`).addField("انت اخترت: ", `${reaction.emoji.name}`, true).addField("انا اخترت: ", `${me}`, true)]
                  }).catch(err => {
                     console.log('Something went wrong')
                  })
                  reaction.message.reactions.removeAll().catch(err => {
                     console.log('Something went wrong')
                  })

               }
               setTimeout(() => {
                  if (msg) {
                     msg.delete().catch(err => {
                        console.log('Something went wrong')
                     })
                  }
               }, 15000);

            });
      

   },
};
