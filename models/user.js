const mongoose = require("mongoose");
const {DEFAULTSETTINGS: defaults} = require("../config");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,

    userID: String,
    username: String,

    class : {
        "type": String,
        "default": "NULL"
    },
    combat_favoriteposition : {
        "type": String,
        "default": "NULL"
    },
    combat_hatedposition : {
        "type": String,
        "default": "NULL"
    },

    faction : {
        "type": String,
        "default": "NULL"
    },

    experience : {
        "type": Number,
        "default": 0
    },
    level : {
        "type": Number,
        "default": 1
    },

    pointsvenitienne : {
        "type": Number,
        "default": 0
    },

    powerpoints : {
        "type": Number,
        "default": 0
    },

    or : {
        "type": Number,
        "default": 0
    },
    maxbank : {
        "type": Number,
        "default": 0
    },
    daily : {
        "type": Date,
        "default": 0
    },

    cooldown_arene : {
        "type": Date,
        "default": 0
    },
    cooldown_pray : {
        "type": Date,
        "default": 0
    },
    cooldown_tacty : {
        "type": Date,
        "default": 0
    },

    cooldown_expedition : {
        "type": Date,
        "default": 0
    },
    expedition_duration : {
        "type": Number,
        "default": 0
    },
    or_expedition : {
        "type": Number,
        "default": 0
    },

    level_mee6 : {
        "type": Number,
        "default": 1
    },

    profil_emote_faction : {
        "type": String,
        "default": ":european_castle:"
    },
    profil_emote_position : {
        "type": String,
        "default": ":heart:"
    }

  

});

module.exports = mongoose.model("User", userSchema);