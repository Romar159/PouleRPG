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

    


    metier : {
        "type": Number,
        "default": 0 // 0 étant la valeur NULL
    },
    heure_travail : { // temps que l'utilisateur travail actuellement
        "type": Number,
        "default": 0
    },
    cooldown_metier : {
        "type": Date,
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
    endettement : {
        "type": Number,
        "default": 0
    },
    daily : {
        "type": Date,
        "default": 0
    },

    wins_quiz : {
        "type": Number,
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
    cooldown_pari : {
        "type": Date,
        "default": 0
    },
    cooldown_ennemi : {
        "type": Date,
        "default": 0
    },
    
    cooldown_entrainement : {
        "type" : Date,
        "default": 0
    },
    heure_entrainement : {
        "type" : Number,
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
    localisation_expedition : {
        "type": String,
        "default": "NULL"
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
    },

    /*fois_dans_le_rouge : {
        "type": Number,
        "default": 0
    },*/

    badges_possedes : {
        "type": String,
        "default": ""
    },
    
    foundedeastereggs : {
        "type": String,
        "default": ""
    },

    arene_streak : {
        "type": Number,
        "default": 0
    },

    titre_honorifique : {
        "type": String,
        "default": "NULL"
    },

    titre_politique : {
        "type": String,
        "default": "NULL"
    },

    // preferences :

    preferences_defaultArene : {
        "type" : String,
        "default" : "dague"
    },

    armeFavorite : {
        "type" : Number,
        "default" : 0
    },

    // états précis :

    in_jail : {
        "Type" : Boolean,
        "default": false
    },
    in_jail_date : { // depuis combien de temps on est aux cachots.
        "Type" : Date,
        "default" : 0
    },

    on_mission : {
        "Type" : Boolean,
        "default": false
    },

    conspiring : {
        "Type" : Boolean,
        "default": false
    },

    working : {
        "Type": Boolean,
        "default": false
    },

    training : {
        "type": Boolean,
        "default": false
    },

    // pts

    powerpoints : { // points de puissance
        "type": Number,
        "default": 0
    },

    piete : {
        "type": Number,
        "default": 0
    },

    prestige : {
        "type": Number,
        "default": 0
    },

    richesse : {
        "type": Number,
        "default": 0
    },

    travail : {
        "type": Number,
        "default": 0
    },

    forme : {
        "type": Number,
        "default": 0
    },

    savoir : {
        "type": Number,
        "default": 0
    },

    moral : {
        "type": Number,
        "default": 0
    },

    ranMinEnnemi : {
        "type": Number,
        "default": 0.7
    },
    ranMaxEnnemi : {
        "type": Number,
        "default": 1.3
    },

    poulets : {
        "type": Number, 
        "default": 0
    }
});

module.exports = mongoose.model("User", userSchema);