const {MessageEmbed} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser, command) => {

    if(message.channel.id != "616652710942343222") return message.reply('Cette commande ne peut être executée que dans le salon <#616652710942343222>');
    if(!args[0]) return message.reply("Veuillez renseigner une faction valide.");
    if(!args[1]) return message.reply("Veuillez renseigner une faction valide.");


    let faction1 = args[0].toLowerCase();
    let faction2 = args[1].toLowerCase();
    faction1 = faction1.charAt(0).toUpperCase() + faction1.slice(1);
    faction2 = faction2.charAt(0).toUpperCase() + faction2.slice(1);
    
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

            if(faction1 == faction2) return message.reply("ERROR: Vous ne pouvez pas signer un armistice entre deux fois la même faction.");
            if(faction1db.en_guerre == false) return message.reply("ERROR: La faction1 n'est pas en guerre.");
            if(faction2db.en_guerre == false) return message.reply("ERROR: La faction2 n'est pas en guerre.");

            
            
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
    usage: '<faction1> <faction2>',
    cooldown: 0, 
    permissions: true,
    args: true
};