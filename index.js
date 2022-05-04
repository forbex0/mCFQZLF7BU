const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

module.exports = client;
const chalk = require("chalk");
// Import Chalk
const ms = require("ms");
// ———————————————[Global Variables]———————————————
client.commands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.config = require("./botconfig/main.json");
client.help = require("./botconfig/help.json");

require("./handler")(client);
// Initializing the project.

// ———————————————[Logging Into Client]———————————————
const token = process.env["clienttoken"] || client.config.clienttoken;
if (token === "") {
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(
      chalk.white("["),
      chalk.red.bold("AntiCrash"),
      chalk.white("]"),
      chalk.gray(" : "),
      chalk.white.bold("Invalid Token")
   );
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(chalk.magenta("There Are 3 Ways To Fix This"));
   console.log(
      chalk.blue("Put Your ") + chalk.red("Bot Token ") + chalk.blue("in:")
   );
   console.log(
      chalk.yellow.bold("1.) ") +
      chalk.cyan("index.js") +
      chalk.gray(
         " On the client.login line remove client.login(token) and write client.login('Your token')"
      )
   );
   console.log(
      chalk.yellow.bold("2.) ") +
      chalk.cyan("ENV/Secrets") +
      chalk.gray(
         " If using replit, make new secret named 'clienttoken' and put your token in it else, if your using VsCode, Then Follow Some ENV tutorials (I don't suggest using it in VSC)"
      )
   );
   console.log(
      chalk.yellow.bold("3.) ") +
      chalk.cyan("main.json ") +
      chalk.gray(
         'Go To botconfig/main.json, Find The Line with client.token and put "client.token":"Your Bot Token"'
      )
   );
   console.log(
      chalk.green.bold("Still Need Help? Contact Me:\n") +
      chalk.yellow.italic("Discord: DrakeZee#5223\n") +
      chalk.yellow.italic("Discord Server: dsc.gg/botsway")
   );
} else {
   client.login(token);
}
// Login The Bot.
// ———————————————[Error Handling]———————————————
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;
process.on("unhandledRejection", (reason, p) => {

   console.log(chalk.gray("—————————————————————————————————"));
   console.log(
      chalk.white("["),
      chalk.red.bold("AntiCrash"),
      chalk.white("]"),
      chalk.gray(" : "),
      chalk.white.bold("Unhandled Rejection/Catch")
   );
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(reason, p);

}
);
process.on("uncaughtException", (err, origin) => {
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(
      chalk.white("["),
      chalk.red.bold("AntiCrash"),
      chalk.white("]"),
      chalk.gray(" : "),
      chalk.white.bold("Uncaught Exception/Catch")
   );
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(
      chalk.white("["),
      chalk.red.bold("AntiCrash"),
      chalk.white("]"),
      chalk.gray(" : "),
      chalk.white.bold("Multiple Resolves")
   );
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(type, promise, reason);

});
// const mongoose = require("mongoose");
// mongoose.connect(`mongodb+srv://abood:abood@cluster0.w91ov.mongodb.net/${client.config.TestingServerID}?authSource=admin&replicaSet=atlas-22gf9a-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`, {
//    useNewUrlParser: true,
//    useUnifiedTopology: true,
// })
//    .then(() => console.log(chalk.green("Connected To MongoDB"))).catch(err => console.log(err))
//    .catch(err => console.log(err));

const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://abood:abood@cluster0.w91ov.mongodb.net/${client.config.ServerID}?authSource=admin&replicaSet=atlas-22gf9a-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})
   .then(() => console.log(chalk.green("Connected To MongoDB"))).catch(err => console.log(err))
   .catch(err => console.log(err));
const db = require("quick.db")
client.on('ready', () => {
   db.set('auctions', 'off')
   db.delete('bids')
   let moneys = db.all()
      .map(entry => entry.ID)
      .filter(id => id.includes(`totalmining`))
   moneys.forEach(db.delete)

})

