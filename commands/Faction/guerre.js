const {army_edition} = require("../../util/commands_modules/guerre_modules/army_edition");
const {units_achat} = require("../../util/commands_modules/guerre_modules/units_achat");
const {units_vente} = require("../../util/commands_modules/guerre_modules/units_vente");
const {diplomatie} = require("../../util/commands_modules/guerre_modules/diplomatie");
const {nommer_commandants} = require("../../util/commands_modules/guerre_modules/nommer_commandants");
const {etat} = require("../../util/commands_modules/guerre_modules/etat");


module.exports.run = async (client, message, args, settings, dbUser) => {

    if(!client.isMaster(message)) return message.reply(`Vous n'êtes pas maître de faction ou maréchal. Vous ne pouvez pas utiliser cette commande.`)

    //TODO faire un embed_interface pour chosir ce qu'on veut faire (il faudra un collector évidemment)

    //TODO dans chaque module, le bouton retour le plus haut (premier embed quand on ouvre la catégorie) devra réouvrir l'interface de guerre cité ci-dessus. Tout en quittant évidemment les collector et tout mais ça je crois que c'est déjà géré
    
    //TODO ne pas oublier qu'il faudra empêcher certains modules si une guerre n'est pas en cours. Ou du moins vérifier qu'on peut pas tout faire planter
    //todo par exemple avec le fait qu'un if vérifie les factions attaquantes et défenseurs mais vérifie pas s'il sont nulles etc...
    //todo le mieux serait donc d'empêceher l'execution de certains module, mais dans le meilleur cas ce serait d'afficher un embed similaire à l'interface
    //todo avec autre chose d'écrit. Comme l'état par exemple juste afficher un bel embed "Vous n'êtes en guerre contre personne."
    

    if(args[0] == "edit") {
        army_edition(client, message, dbUser);
    }
    else if(args[0] == "achat") {
        
        units_achat(client, message, dbUser);
    } else if(args[0] == "vente") {

        units_vente(client, message, dbUser);

    } else if(args[0] == "diplomatie") {

        diplomatie(client, message, dbUser);

    } else if(args[0] == "commandants") {

        nommer_commandants(client, message, dbUser);

    } else if(args[0] == "état") {
        etat(client, message, dbUser);
    }
    
}

module.exports.help = {
    name: "guerre",
    aliases: ['guerilla', 'thewar', 'tchounasslecombat', 'laguerrenemeurtjamais', 'easy', 'ez'],
    category: "faction",
    desription: "Gérez tous les aspects de la guerre en une seule commande ! Notez que pour la majorité des options vous aurez un quart d'heure pour les modifier. Veillez à bien quitter les menus si vous n'utilisez plus le bot avant ce temps-là pour l'alléger un peu, merci à ceux qui y penserons ! :)",
    usage: '',
    cooldown: 1, 
    permissions: false,
    args: false,
};