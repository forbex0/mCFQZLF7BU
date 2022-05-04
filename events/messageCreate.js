const client = require("../index")
const { MessageEmbed } = require("discord.js");
const chalk = require("chalk");
const ms = require("ms");
const { developerID } = require("../botconfig/main.json");
const { clientavatar } = require("../botconfig/main.json");
const { clientname } = require("../botconfig/main.json");
const prefix = client.config.prefix;
const { color } = require("../botconfig/help.json");
const bank = require("../models/schema.js");
const Discord = require("discord.js");
const { randomMessages_Cooldown } = require("../botconfig/main.json");
const { e } = require("mathjs");
const cooldowns = new Map();
client.on("messageCreate", async (message) => {
   const clientname = client.user.username
   if (message.channel.id !== client.config.bankchannelid) return;
   if (
      message.author.bot ||
      !message.guild ||
      !message.content.toLowerCase().startsWith(client.config.prefix)
   )
      return;
   if (!message.member)
      message.member = await message.guild.fetchMember(message);
   const [cmd, ...args] = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(" ");
   let noargs_embed = new MessageEmbed()
      .setTitle(`:x: | Please Provide A Command To Be Executed!`)
      .setColor("RED")
      .setFooter({ text: `${clientname}`, iconURL: client.user.avatarURL() })
      .setTimestamp();
   if (cmd.length === 0) return message.reply({ embeds: [noargs_embed] });

   const command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));
   let nocmd_embed = new MessageEmbed()
      .setTitle(`:x: | No Command Found! Try Using  \`${prefix}help\``)
      .setColor("RED")
      .setFooter({ text: `${clientname}`, iconURL: client.user.avatarURL() })
      .setTimestamp();
   if (!command) return;
   if (command.toggleOff) {
      let toggleoff_embed = new MessageEmbed()
         .setTitle(
            `:x: | That Command has been disabled by the developers!\n visit the support server for more info!`
         )
         .setColor("RED")
         .setFooter({ text: `${clientname}`, iconURL: client.user.avatarURL() })
         .setTimestamp();
      return message.reply({ embeds: [toggleoff_embed] });
   } else if (!message.member.permissions.has(command.userpermissions || [])) {
      let userperms_embed = new MessageEmbed()
         .setTitle(`:x: | You Don't Have Permissions To Use The Command!`)
         .setColor("RED")
         .setFooter({ text: `${clientname}`, iconURL: client.user.avatarURL() })
         .setTimestamp();
      return message.reply({ embeds: [userperms_embed] });
   } else if (!message.guild.me.permissions.has(command.botpermissions || [])) {
      let botperms_embed = new MessageEmbed()
         .setTitle(`:x: | I Don't Have Permissions To Use The Command!`)
         .setColor("RED")
         .setFooter({ text: `${clientname}`, iconURL: client.user.avatarURL() })
         .setTimestamp();
      return message.reply({ embeds: [botperms_embed] });
   } else if (command.developersOnly) {
      if (!developerID.includes(message.author.id)) {
         let developersOnly_embed = new MessageEmbed()
            .setTitle(`:x: | Only Developers Can Use That Command!`)
            .setDescription(
               `Developers: ${developerID.map((v) => `<@${v}>`).join(",")}`
            )
            .setColor("RED")
            .setFooter({ text: `${clientname}`, iconURL: client.user.avatarURL() })
            .setTimestamp();
         return message.reply({ embeds: [developersOnly_embed] });
      }
   } else if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
   }

   const current_time = Date.now();
   const time_stamps = cooldowns.get(command.name);
   const cooldown_amount = (command.cooldown) * 1000;
   
   //If time_stamps has a key with the author's id then check the expiration time to send a message to a user.
   if (time_stamps.has(message.author.id)) {
      const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

      if (current_time < expiration_time) {
         const time_left = (expiration_time - current_time) / 1000;

         return message.reply(
            {
               embeds: [new Discord.MessageEmbed()
                  .setColor('#fe0100')
                  .setDescription(`⌛ | Please wait ${time_left.toFixed(0)} seconds before reusing the \`${command.name}\` command.`)]
            }

         )
      }
   }

   time_stamps.set(message.author.id, current_time);
   setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);


   await command.run(client, message, args);
});
/*
 * ———————————————[Credits]———————————————
 * Made by : DrakeZee#5223
 * Support Server : dsc.gg/BotsWay
 * Youtube : youtube.com/DrakeZee
 * Please Help Me Reach 1k Subs DJs Codes And More Amazing * Stuff!
 * Also Add Me Friend When Using This, I Have No Friends :(
 * 
 * This Was Only Possible By Following People :
 *
 * recon#8448  | youtube.com/reconlxx | discord.gg/recon
 * Tomato#6966 | milrato.dev         | discord.gg/milrato
 */
