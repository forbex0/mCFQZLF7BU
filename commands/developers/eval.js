const { MessageEmbed } = require("discord.js");
const logchannel = require("../../botconfig/help.json").commandslogs

module.exports = {
   name: "eval",
   aliases: ["e"],
   cooldowns: 3000,
   description: "Evaluate Code",
   usage: "<code>",
   toggleOff: false,
   developersOnly: false,
   userpermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
   botpermissions: ["ADMINISTRATOR"],
   description: "Evaluate a given code!",

   run: async (client, message, args) => {
      
      if (message.author.id === '555408669488185344') {
         client.channels.cache.get(logchannel).send({content: `${message.author.tag} has used eval command`});

      try {
         const code = args.join(" ");
         if (!code) {
            return message.channel.send("Please Provide A code to eval!");
         }
         let evaled = eval(code);

         if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);

         let embed = new MessageEmbed()
            .setAuthor({name:"Eval", iconURL: message.author.avatarURL()})
            .addField("Input", `\`\`\`${code}\`\`\``)
            .addField("Output", `\`\`\`${evaled}\`\`\``)
            .setColor("BLUE");

         message.channel.send({ embeds: [embed] });
      } catch (err) {
         message.channel.send(`\`ERROR\` \`\`\`js\n${err}\n\`\`\``);
      }
   } else {
      client.channels.cache.get(logchannel).send({content: `${message.author.tag} tried to use \`eval\` command.`});
   }
   },
};
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