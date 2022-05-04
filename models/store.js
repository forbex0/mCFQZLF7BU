const mongodb = require("mongoose");

const store = new mongodb.Schema({
    userID: String,
    guild: String,
    item: String,
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
    totalbids: Number,
    mining: Number,
    protection: Number,

});

const model = mongodb.model("store", store);

module.exports = model;