const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {

    /*
    TODO    Vérifie si on est maître.
    TODO    Vérifie si on est pas déjà allié.
    TODO    Vérifie le nombre de points d'amitié
    TODO    S'il est suffisant POUR LES DEUX factions -> faire une demande d'alliance
    TODO    L'autre faction à genre 30 seconde pour accepter (parce que c'est le genre de truc qui se fait un peu en mod RP, pas juste avec une commande).
    TODO    Si elle est d'accord -> Forger l'alliance.
    */

    return message.channel.send("Cette commande est prévu pour la post-bêta.");
    
};

module.exports.help = {
    name: "alliance",
    aliases: ['alliance'],
    category: "Politique, Diplomatie et Economie",
    desription: "Forge une alliance entre deux factions.",
    usage: "<faction>",
    cooldown: 3,
    permissions: false,
    args: true,
};