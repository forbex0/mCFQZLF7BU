const mongodb = require("mongoose");

const bank = new mongodb.Schema({
    userID: String,
    money: Number,
    user: String,
    lastDaily: String,
    GuildID: String,
    CoolDown: String,
    accountage: String,
    ratb: String,
    luck: Number,
    points: Number,
    blacklist: String,
    totalsteal: Number,
});

const model = mongodb.model("bank", bank);

module.exports = model;