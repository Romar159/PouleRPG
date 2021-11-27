const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {
    let faction1db = await client.getFaction(dbUser.faction);
    
   
    if(args[0].toLowerCase() == "voir") {
        const embedView = new MessageEmbed()
            .setColor('8C4638')
            .setAuthor(`Visualisation de la formation`, client.user.displayAvatarURL())
            .addField(`A1`, `<@${faction1db.a1}>`, true) .addField(`A2`, `<@${faction1db.a2}>`, true) .addField(`A3`, `<@${faction1db.a3}>`, true)
            .addField(`B1`, `<@${faction1db.b1}>`, true) .addField(`B2`, `<@${faction1db.b2}>`, true) .addField(`B3`, `<@${faction1db.b3}>`, true)
            .addField(`C1`, `<@${faction1db.c1}>`, true) .addField(`C2`, `<@${faction1db.c2}>`, true) .addField(`C3`, `<@${faction1db.c3}>`, true);
        return message.channel.send({embeds:[embedView]});
    }

    if(!message.mentions.members.first() && args[1] != "retirer") return message.reply("vous devez mentionner un utilisateur valide.");
    const position = args[0].toLowerCase();
    var roles_maitre = ["445617906072682514", "445617911747313665", "445617908903706624", "665340068046831646"];
    var est_maitre = false;
    var mention;
    if(args[1] == "retirer")
        mention = "NULL";
    else
        mention = message.mentions.members.first();

    if(mention != "NULL") {
        const dbmention = client.getUser(message.mentions.members.first()); // ? Peut être utile (pour Draxy ?).
    }
    
    for(let y=0; y<roles_maitre.length; y++) {
        if(message.member.roles.cache.has(roles_maitre[y])) {
            est_maitre = true;
            break;
        } else {
            est_maitre = false;
        }
    }
    if(!est_maitre) return message.reply("commande utilisable que par les maîtres de faction.");
    if(mention != "NULL") {
        if(!mention.roles.cache.has(faction1db.roleid)) return message.reply("cet utilisateur n'est pas dans votre faction.");
    }

    if(position == "a1" || position == "1a") {
        await client.verifposition(client, dbUser, mention, faction1db);
        membre_retire = faction1db.a1;
        await client.updateFaction(dbUser.faction, {a1: mention});
    }
    else if(position == "a2" || position == "2a") {
        await client.verifposition(client, dbUser, mention, faction1db);
        membre_retire = faction1db.a2;
        await client.updateFaction(dbUser.faction, {a2: mention});
    }
    else if(position == "a3" || position == "3a") {
        await client.verifposition(client, dbUser, mention, faction1db);
        membre_retire = faction1db.a3;
        await client.updateFaction(dbUser.faction, {a3: mention});
    }
    
    else if(position == "b1" || position == "1b") {
        await client.verifposition(client, dbUser, mention, faction1db);
        membre_retire = faction1db.b1;
        await client.updateFaction(dbUser.faction, {b1: mention});
    } 
    else if(position == "b2" || position == "2b") {
        await client.verifposition(client, dbUser, mention, faction1db);
        membre_retire = faction1db.b2;
        await client.updateFaction(dbUser.faction, {b2: mention});
    }
    else if(position == "b3" || position == "3b") {
        await client.verifposition(client, dbUser, mention, faction1db);
        membre_retire = faction1db.b3;
        await client.updateFaction(dbUser.faction, {b3: mention});
    }
    
    else if(position == "c1" || position == "1c") {
        await client.verifposition(client, dbUser, mention, faction1db);
        membre_retire = faction1db.c1;
        await client.updateFaction(dbUser.faction, {c1: mention});
    }
    else if(position == "c2" || position == "2c") {
        await client.verifposition(client, dbUser, mention, faction1db);
        membre_retire = faction1db.c2;
        await client.updateFaction(dbUser.faction, {c2: mention});
    }
    else if(position == "c3" || position == "3c") {
        await client.verifposition(client, dbUser, mention, faction1db);
        membre_retire = faction1db.c3;
        await client.updateFaction(dbUser.faction, {c3: mention});
    }
    else
        return message.reply("ERROR: Vous devez spécifier une position valide.");
    
    if(mention == "NULL" && membre_retire != "NULL") return message.channel.send(`**<@${membre_retire}> a été retiré de la formation.**`);
    if(mention == "NULL" && membre_retire == "NULL") return message.channel.send(`Il n'y a personne à cette position.`);

    faction1db = await client.getFaction(dbUser.faction); //update.
    const embedFormation = new MessageEmbed()
        .setColor('8C4638')
        .setAuthor(`${mention.user.username} a été placé en ${args[0]}`, client.user.displayAvatarURL())
        .addField(`A1`, `<@${faction1db.a1}>`, true) .addField(`A2`, `<@${faction1db.a2}>`, true) .addField(`A3`, `<@${faction1db.a3}>`, true)
        .addField(`B1`, `<@${faction1db.b1}>`, true) .addField(`B2`, `<@${faction1db.b2}>`, true) .addField(`B3`, `<@${faction1db.b3}>`, true)
        .addField(`C1`, `<@${faction1db.c1}>`, true) .addField(`C2`, `<@${faction1db.c2}>`, true) .addField(`C3`, `<@${faction1db.c3}>`, true);

    message.channel.send({embeds:[embedFormation]});
    };

module.exports.help = {
    name: "formation",
    aliases: ['formation', 'former'],
    category: "guerre",
    desription: "Forme votre armée.",
    usage: "[<voir>] [<position> <@USER/retirer>]",
    cooldown: 3,
    permissions: false,
    args: true
};