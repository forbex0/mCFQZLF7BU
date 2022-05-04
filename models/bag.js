const mongodb = require("mongoose");

const bag = new mongodb.Schema({
    userID: String,
    id:String,
    price: Number,
    hotel: Number,
    building: Number,
    apartment: Number,
    house: Number,
    villa: Number,
    club: Number,
    casino: Number,
    stadium: Number,
    bank: Number,
    mining: Number,
    protection: Number,
});

const model = mongodb.model("bag", bag);

module.exports = model;