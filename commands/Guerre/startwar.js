const {MessageEmbed} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser, command) => {

    if(message.channel.id != "616652710942343222") return message.reply('Cette commande ne peut être executée que dans le salon <#616652710942343222>');
    if(!args[0]) return message.reply("veuillez entrer une faction valide.");
    if(!args[1]) return message.reply("veuillez entrer une faction valide.");

    let faction1 = args[0].toLowerCase();
    let faction2 = args[1].toLowerCase();

    faction1 = faction1.charAt(0).toUpperCase() + faction1.slice(1);
    faction2 = faction2.charAt(0).toUpperCase() + faction2.slice(1);

    let faction1id;
    let faction2id;

    try {
        const faction1db = await client.getFaction(args[0].toLowerCase());
        const faction2db = await client.getFaction(args[1].toLowerCase());
        
        
        switch(faction1) {
            case "Epsilon":
            break;

            case "Daïros":
            break;

            case "Lyomah":
                break;

            case "Alpha":
                break;

            default:
                return message.reply("veuillez entrer une faction valide.");
            }

        switch(faction2) {
            case "Epsilon":
                break;

            case "Daïros":
                break;

                case "Lyomah":
            break;

            case "Alpha":
                break;

            default:
                return message.reply("veuillez entrer une faction valide.");
            }

            if(faction1db.name == faction2db.name) return message.reply("ERROR: Impossible de lancer une guerre avec la même faction.");
            if(faction1db.ally == faction2db.name) return message.reply("Ces deux factions sont alliées");
            message.channel.send(`ALLY: ${faction1db.ally} | name2: ${faction2db.name}`);

            if(faction1db.en_guerre == true || faction2db.en_guerre == true) return message.reply("ERROR: L'une des faction est déjà en guerre.");
            
            
            message.channel.send(`**PRÉPAREZ-VOUS AU COMBAT !\nLa guerre est déclarée entre <@&${faction1db.roleid}> et <@&${faction2db.roleid}> !**`);

            client.updateFaction(args[0].toLowerCase(), {en_guerre: true, ennemy: args[1].toLowerCase(), ptsvictoire: 0});
            client.updateFaction(args[1].toLowerCase(), {en_guerre: true, ennemy: args[0].toLowerCase(), ptsvictoire: 0});

            message.delete();
        
        } catch(e) {
            return message.channel.send(`Error: ${e}`);
        }
    }
    
module.exports.help = {
    name: "guerre",
    aliases: ['easy'],
    category: "guerre",
    desription: "Démarre une guerre entre deux factions.",
    usage: '<faction1> <faction2>',
    cooldown: 0, 
    permissions: true,
    args: true
};