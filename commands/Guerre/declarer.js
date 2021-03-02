const {MessageEmbed} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser, command) => {
   
    if(message.channel.id != "616652710942343222") return message.reply('Cette commande ne peut être executée que dans le salon <#616652710942343222>');
    
    let faction = args[0].toLowerCase();
    let casus_beli = args.join(" ").slice(args[0].length); 

    faction = faction.charAt(0).toUpperCase() + faction.slice(1);
    let factionusr = dbUser.faction.charAt(0).toUpperCase() + dbUser.faction.slice(1);
    if(factionusr == faction) return message.reply("Vous ne pouvez pas déclarer la guerre à votre faction.");

    switch(faction) {
        case "Epsilon":
        break;

        case "Daïros":
        break;

        case "Lyomah":
        break;

        case "Alpha":
        break;

        default:
            return message.reply("Veuillez entrer une faction valide.");
    }
    if(!args[1]) message.reply("WARNING: Ne pas indiquer de casus beli assure quasiment à 100% le refus par les Empereurs.");

    
    message.channel.send(`Déclaration de guerre entre ${factionusr} et ${faction} envoyée. Avec comme casus-beli :${casus_beli}.\n<@&485757061305729056> vont vérifier votre casus beli et valider ou non la guerre.`);
}

module.exports.help = {
    name: "declarer",
    aliases: ['declarer'],
    category: "guerre",
    desription: "Declarez la guerre à une faction.",
    usage: '<faction> [casus beli]',
    cooldown: 30, 
    permissions: false,
    args: true
};