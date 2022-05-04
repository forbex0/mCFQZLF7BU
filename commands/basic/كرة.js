const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const ms = require("ms");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
   name: "كرة",
   aliases: ["football", "ftb"],
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
      const positions = {
         left: '_ _                   🥅🥅🥅\n_ _                   🕴️\n      \n_ _                         ⚽',
         middle: '_ _                   🥅🥅🥅\n_ _                        🕴️\n      \n_ _                         ⚽',
         right: '_ _                   🥅🥅🥅\n_ _                              🕴️\n      \n_ _                         ⚽',
      };
      let randomized = Math.floor(Math.random() * Object.keys(positions).length);
      let gameEnded = false;
      let randomPos = positions[Object.keys(positions)[randomized]];

      const componentsArray = [
         {
            type: 1,
            components: [
               {
                  type: 2,
                  style: 'SECONDARY',
                  custom_id: 'left',
                  label: 'يسار',
               },
               {
                  type: 2,
                  style: 'PRIMARY',
                  custom_id: 'middle',
                  label: 'وسط',
               },
               {
                  type: 2,
                  style: 'SECONDARY',
                  custom_id: 'right',
                  label: 'يمين',
               },
            ],
         },
      ];

      const msg = await message.reply({
         content: randomPos,
         components: componentsArray,
      });
      function update() {
         randomized = Math.floor(Math.random() * Object.keys(positions).length);
         randomPos = positions[Object.keys(positions)[randomized]];

         msg.edit({
            content: randomPos,
            components: componentsArray,
         });

      }

      // setTimeout(() => {
      //    gameEnded = true;
      //    msg.delete().catch(c => console.log(`msg cannot be deleted ${c}`))
      // }, 5000);
      setTimeout(() => {
         const mebed = new Discord.MessageEmbed()
         if (gameEnded == true) { msg.delete().catch(c => console.log(`msg cannot be deleted ${c}`)) } else { message.reply({ embeds: [mebed.setDescription(`لديك لعبة مازالت بنتظارك, [اضغط هنا](${msg.url})`).setColor('RANDOM')] }) }
      }, 15000);

      setInterval(() => {
         if (gameEnded == false) return update();
      }, 1000);

      const filter = button => {
         return button.user.id === message.author.id;
      };
      const button = await msg.awaitMessageComponent({ filter: filter, componentType: 'BUTTON', max: 1 })
     

      if (button.customId !== Object.keys(positions)[randomized]) {
         await bank.findOneAndUpdate({ userID: message.author.id }, { $inc: { money: 10000 } });
         gameEnded = true;
         return message.reply({
            embeds: [
               bm = new Discord.MessageEmbed()
                  .setDescription(`مبروووووك فزت , بس لا تتحمس ترا المرة الجاي بفوز عليك!`).setColor('GREEN')
                  .setFooter({ text: 'تم اضافة 10,000 ريال في حسابك' })
            ]
         })
      }
      else {
         gameEnded = true;
         return message.reply({
            embeds: [
               bm = new Discord.MessageEmbed()
                  .setDescription(`صديتها وراحت عليك 10000$ ,حاول المرة الجاي`).setColor('RED')
            ]
         });

      }

   },
};
