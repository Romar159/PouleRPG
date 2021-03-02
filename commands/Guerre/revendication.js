const {MessageEmbed} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser, command) => {
   
    if(message.channel.id != "616652710942343222") return message.reply('Cette commande ne peut être executée que dans le salon <#616652710942343222>');

    // TODO: Vérifier le nombre de points de victoire, si c'est trop bas : return -> trop bas | Si c'est assez haut -> return réussite de guerre plus tout ce qui se passe à la fin d'une guerre avec le bot (après il y a du plus RP) -> genre la thunass et de l'xp etc...


}

module.exports.help = {
    name: "revendication",
    aliases: ['revendication', 'rvdcat'],
    category: "guerre",
    desription: "Appuie les revendications de votre faction et fini la guerre !",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false
};