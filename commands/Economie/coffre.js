const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {

    if(dbUser.faction == "NULL") return message.channel.send("Vous n'avez pas de faction.");
    const faction = await client.getFaction(dbUser.faction);
    const embed = new MessageEmbed();
    let ppmaitre = message.guild.members.cache.get(faction.idmaitre)

    if(message.channel.id == '445289059892461578' && faction.factionid == 0) { //Epsilon
        embed.setColor('AA3C00')
        .setAuthor(`Coffre d'Epsilon`, ppmaitre.user.displayAvatarURL())
        .setDescription(`**:bank: ${faction.bank} or.**`);
        return message.channel.send({embeds:[embed]});
    }
    if(message.channel.id == '445289032419770378' && faction.factionid == 1) { //Daïros
        embed.setColor('0078F0')
        .setAuthor(`Coffre de Daïros`, ppmaitre.user.displayAvatarURL())
        .setDescription(`**:bank: ${faction.bank} or.**`);
        return message.channel.send({embeds:[embed]});
    }
    if(message.channel.id == '445289003156242434' && faction.factionid == 2) { //Lyomah
        embed.setColor('00A00A')
        .setAuthor(`Coffre de Lyomah`, ppmaitre.user.displayAvatarURL())
        .setDescription(`**:bank: ${faction.bank} or.**`);
        return message.channel.send({embeds:[embed]});
    }
    if(message.channel.id == '667858618342834216' && faction.factionid == 3) { //Alpha
        embed.setColor('F0C800')
        .setAuthor(`Coffre d'Alpha`, ppmaitre.user.displayAvatarURL())
        .setDescription(`**:bank: ${faction.bank} or.**`);
        return message.channel.send({embeds:[embed]});
    }
    else message.channel.send("Cette commande ne peut s'exécuter que dans votre salon de faction.");
};

module.exports.help = {
    name: "coffre",
    aliases: ['coffre de faction'],
    category: "economie",
    desription: "Affiche le contenu du coffre de faction.",
    usage: "",
    cooldown: 3,
    permissions: false,
    args: false
};