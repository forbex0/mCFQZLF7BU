const mongodb = require("mongoose");

const marry = new mongodb.Schema({
    male: String,
    female: String,
    guild: String,
    mhr:Number,
    date: String

});

const model = mongodb.model("marry", marry);

module.exports = model;