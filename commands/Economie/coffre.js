const {EmbedBuilder} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);


    if(dbUser.faction == "NULL") return message.channel.send("Vous n'avez pas de faction.");
    const faction = await client.getFaction(dbUser.faction);
    const embed = new EmbedBuilder();
    let ppmaitre = message.guild.members.cache.get(faction.idmaitre)

    if(message.channel.id == '445289059892461578' && faction.factionid == 0) { //Epsilon
        embed.setColor('AA3C00')
        .setAuthor({name: `Coffre d'Epsilon`, iconURL: ppmaitre.user.displayAvatarURL()})
        .setDescription(`**:bank: ${faction.bank} poyn.**`);

        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${faction.name} a ${faction.bank} or`);

        return message.channel.send({embeds:[embed]});
    }
    if(message.channel.id == '445289032419770378' && faction.factionid == 1) { //Daïros
        embed.setColor('0078F0')
        .setAuthor({name: `Coffre de Daïros`, iconURL: ppmaitre.user.displayAvatarURL()})
        .setDescription(`**:bank: ${faction.bank} poyn.**`);

        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${faction.name} a ${faction.bank} or`);

        return message.channel.send({embeds:[embed]});
    }
    if(message.channel.id == '445289003156242434' && faction.factionid == 2) { //Lyomah
        embed.setColor('00A00A')
        .setAuthor({name: `Coffre de Lyomah`, iconURL: ppmaitre.user.displayAvatarURL()})
        .setDescription(`**:bank: ${faction.bank} poyn.**`);

        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${faction.name} a ${faction.bank} or`);

        return message.channel.send({embeds:[embed]});
    }
    if(message.channel.id == '667858618342834216' && faction.factionid == 3) { //Alpha
        embed.setColor('F0C800')
        .setAuthor({name: `Coffre d'Alpha`, iconURL: ppmaitre.user.displayAvatarURL()})
        .setDescription(`**:bank: ${faction.bank} poyn.**`);

        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${faction.name} a ${faction.bank} or`);

        return message.channel.send({embeds:[embed]});
    }
    else message.channel.send("Cette commande ne peut s'exécuter que dans votre salon de faction.");
};

module.exports.help = {
    name: "coffre",
    aliases: ['coffre_de_faction'],
    category: "economie",
    desription: "Affiche la quantité de poyn du coffre de faction. Étant une information privé elle ne peut s'exécuter que dans le salon de votre faction.",
    usage: "",
    cooldown: 3,
    permissions: false,
    args: false
};