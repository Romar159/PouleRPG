const mongoose = require("mongoose");
const {DEFAULTSETTINGS: defaults} = require("../config");

const factionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    channelid : String,
    roleid: String,

    factionid : {
        "type": Number,
        "default": 0
    },

    idmaitre : {
        "type": String,
        "default": "NULL"
    },

    bank : {
        "type": Number,
        "default": 0
    },
    ptsvictoire : {
        "type": Number,
        "default": 0
    },

    ptsami_epsilon: Number,
    ptsami_dairos: Number,
    ptsami_lyomah: Number,
    ptsami_alpha: Number,

    bonus_shop_maitre: Number
    

});

module.exports = mongoose.model("Faction", factionSchema);