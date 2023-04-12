const {army_edition} = require("../../util/commands_modules/guerre_modules/army_edition");
const {units_achat} = require("../../util/commands_modules/guerre_modules/units_achat");
const {diplomatie} = require("../../util/commands_modules/guerre_modules/diplomatie");

module.exports.run = async (client, message, args, settings, dbUser) => {

    if(!client.isMaster(message)) return message.reply(`Vous n'êtes pas maître de faction ou maréchal. Vous ne pouvez pas utiliser cette commande.`)

    // faire un embed_interface pour chosir ce qu'on veut faire 
    
    if(args[0] == "edit") {
        army_edition(client, message, dbUser);
    }
    else if(args[0] == "achat") {
        units_achat(client, message, dbUser);
    } else if(args[0] == "diplomatie") {

        diplomatie(client, message, dbUser);

        // let rel = await client.getRelation("epsilon", "daïros");
        // message.channel.send(`${rel.display_name}`)
    }
    
}

module.exports.help = {
    name: "guerre",
    aliases: ['guerilla', 'thewar', 'tchounasslecombat', 'laguerrenemeurtjamais', 'easy', 'ez'],
    category: "guerre",
    desription: "Gérez tous les aspects de la guerre en une seule commande ! Notez que pour la majorité des options vous aurez un quart d'heure pour les modifier. Veillez à bien quitter les menus si vous n'utilisez plus le bot avant ce temps-là pour l'alléger un peu, merci à ceux qui y penserons ! :)",
    usage: '',
    cooldown: 1, 
    permissions: false,
    args: false,
};