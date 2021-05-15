const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {
    if(dbUser.faction == "NULL") return message.channel.send("Vous n'êtes pas membre d'une faction.");
    if(isNaN(args[0])) return message.channel.send("Vous devez entrer une valeur numérique.");

    const faction = await client.getFaction(dbUser.faction);
    await client.updateFaction(dbUser.faction, {bank: (faction.bank + parseInt(args[0]))});
    await client.setOr(client, message.member, - args[0], message);
    let ppmaitre = message.guild.member(faction.idmaitre);
    const embed = new MessageEmbed()
    .setColor('5E6366')
    .setAuthor(`Envoie effectué`, ppmaitre.user.displayAvatarURL())
    .setDescription(`:bank: ${message.author} a ajouté **${args[0]} or** à son coffre de faction.`);

    message.channel.send(embed);
};

module.exports.help = {
    name: "envoiecoffre",
    aliases: ['envcoffre'],
    category: "economie",
    desription: "Envoie de l'argent dans votre coffre de faction.",
    usage: "<or>",
    cooldown: 3,
    permissions: false,
    args: true
};