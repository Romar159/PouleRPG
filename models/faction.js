const mongoose = require("mongoose");
const {DEFAULTSETTINGS: defaults} = require("../config");

const factionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    displayname: String,
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

    
    marechal: {
        "type": String,
        "default": "NULL"
    },
    intendant: {
        "type": String,
        "default": "NULL"
    },
    chapelain: {
        "type": String,
        "default": "NULL"
    },

    joueurs_sur_le_territoire: {
        "type": Array,
        "default": ['']
    },

    relations: {
        "type": Array,
        "default": [0, 0, 0, 0]
    },

    commandants: {
        "type": Array,
        "default": ["NULL", "NULL", "NULL"]
    },

    casusbelli: Array,
    cachot: Array,
    

    ptsami_epsilon: Number,
    ptsami_dairos: Number,
    ptsami_lyomah: Number,
    ptsami_alpha: Number,

    en_guerre: Boolean,
    date_debut_guerre: {
        "type": Date,
        "default": 0
    },
    attaquant: {
        "type": String,
        "default": "NULL"
    },
    defensseur: {
        "type": String,
        "default": "NULL"
    },
    casusbelli_utilise: {
        "type": Number,
        "default": -1
    },
    score_guerre: {
        "type": Number,
        "default": 0
    }
    

});

module.exports = mongoose.model("Faction", factionSchema);