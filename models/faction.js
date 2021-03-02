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

    cooldown_battle : {
        "type": Date,
        "default": 0
    },

    taxe: {
        "type": Number,
        "default": 0
    },

    cooldown_taxe : {
        "type": Date,
        "default": 0
    },

    ptsami_epsilon: Number,
    ptsami_dairos: Number,
    ptsami_lyomah: Number,
    ptsami_alpha: Number,

    bonus_shop_maitre: Number,

    en_guerre: Boolean,
    ennemy: String,
    ally: String,

    a1: String,
    a2: String,
    a3: String,

    b1: String,
    b2: String,
    b3: String,
    
    c1: String,
    c2: String,
    c3: String,

});

module.exports = mongoose.model("Faction", factionSchema);