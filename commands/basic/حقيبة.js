const Discord = require("discord.js");
const bank = require("../../models/schema.js");
const cooldowns = new Map();
const humanizeDuration = require('humanize-duration')
const bag = require("../../models/bag.js");

module.exports = {
   name: "حقيبة",
   aliases: ["bag"],
   description: "Returns Websocket Ping",
   botpermissions: ["SEND_MESSAGES"],
   usage: "How Fast The Bot is?",
   developersOnly: false,
   toggleOff: false,
   run: async (client, message, args) => {
      const userBank = await bag.findOne({ userID: message.author.id });
      if (!userBank) {
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

      //       let items = []
      //       let useritems = await bag.findOne({ userID: message.author.id })
      //       useritems.forEach(item => {
      //          items.push(item.items)
      //       })
      //       if (!useritems) return message.reply(`You didn't bought anything before , type \`-bag\`!`);

      //       const embed = new Discord.MessageEmbed()
      //       .setDescription(`
      // ${items.join("\n")}
      // `)

      const cooldown = cooldowns.get(message.author.id);
      if (cooldown) {
         const remaining = humanizeDuration(cooldown - Date.now());

         return message.reply(`:x: | **\`${remaining}\` , انتظر لاهنت**`)
            .catch(console.error);
      }
      let useritems = await bag.findOne({ userID: message.author.id })
      // let items = await bag.find().sort({ id: 1 })
      let building = useritems.building || 0
      let hotel = useritems.hotel || 0
      let casino = useritems.casino || 0
      let house = useritems.house || 0
      let club = useritems.club || 0
      let villa = useritems.villa || 0
      let mining = useritems.mining || 0
      let bank = useritems.bank || 0
      let apartment = useritems.apartment || 0
      let protection = useritems.protection || 0


      const embed = new Discord.MessageEmbed()
         .setThumbnail("https://cdn.discordapp.com/attachments/947898070845247529/968210115360591942/skyscraper.png?size=4096")
         .setTitle(`${message.author.tag}'s املاك`)
         .setColor("RANDOM")
         .addField(`\`Building\` | ID: \`1\``, `الكمية: \`${building}\``, true)
         .addField(`\`Hotel\` | ID: \`2\``, `الكمية: \`${hotel}\``, true)
         .addField(`\`Casino\` | ID: \`3\``, `الكمية: \`${casino}\``, true)
         .addField(`\`House\` | ID: \`4\``, `الكمية: \`${house}\``, true)
         .addField(`\`Club\` | ID: \`5\``, `الكمية: \`${club}\``, true)
         .addField(`\`Villa\` | ID: \`6\``, `الكمية: \`${villa}\``, true)
         .addField(`\`Mining rig's\` | ID: \`7\``, `الكمية: \`${mining}\``, true)
         .addField(`\`Bank\` | ID: \`8\``, `الكمية: \`${bank}\``, true)
         .addField(`\`Apartment\` | ID: \`9\``, `الكمية: \`${apartment}\``, true)
         .addField(`\`Protection\` | ID: \`10\``, `الكمية: \`${protection}\``, true)

      message.reply({ embeds: [embed] })

   },
};
