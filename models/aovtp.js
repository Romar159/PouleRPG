const mongoose = require("mongoose");
const {DEFAULTSETTINGS: defaults} = require("../config");

const aovtpSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    categorie: String,
    texte: String
});

module.exports = mongoose.model("Aovtp", aovtpSchema);