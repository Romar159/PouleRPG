const {MessageEmbed} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser, command) => {

    if(message.channel.id != "616652710942343222") return message.reply('Cette commande ne peut être executée que dans le salon <#616652710942343222>');

    let faction1 = args[0].toLowerCase();
    faction1 = faction1.charAt(0).toUpperCase() + faction1.slice(1);
    
    // TODO : On peut pas signer une armisitice pour une faction dans laquelle on n'est pas dedans !
    try {
        const faction1db = await client.getFaction(args[0].toLowerCase());
        const faction2db = await client.getFaction(faction1db.ennemy);
        
        
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

            if(faction1db.en_guerre == false) return message.reply("ERROR: La faction n'est pas en guerre.");
            
            
            message.channel.send(`Armistice signé entre <@&${faction1db.roleid}> et <@&${faction2db.roleid}>`);

            client.updateFaction(args[0].toLowerCase(), {en_guerre: false, ennemy: "", ptsvictoire: 0});
            client.updateFaction(faction1db.ennemy, {en_guerre: false, ennemy: "", ptsvictoire: 0});

            message.delete();
        
        } catch(e) {
            return message.channel.send(`Error: ${e}`);
        }
    }
    
module.exports.help = {
    name: "armistice",
    aliases: ['armistice'],
    category: "guerre",
    desription: "Arrête une guerre.",
    usage: '<faction>',
    cooldown: 0, 
    permissions: true,
    args: true
};