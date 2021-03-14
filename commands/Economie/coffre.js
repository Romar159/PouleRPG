const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {

    if(dbUser.faction == "NULL") return message.channel.send("Vous n'avez pas de faction.");
    const faction = await client.getFaction(dbUser.faction);

    if(message.channel.id == '445289059892461578') return message.channel.send(`Contenu du coffre Epsilon : ${faction.bank} or.`);
    if(message.channel.id == '445289032419770378') return message.channel.send(`Contenu du coffre Daïros : ${faction.bank} or.`);
    if(message.channel.id == '445289003156242434') return message.channel.send(`Contenu du coffre Lyomah : ${faction.bank} or.`);
    if(message.channel.id == '667858618342834216') return message.channel.send(`Contenu du coffre Alpha : ${faction.bank} or.`);
    else message.channel.send("Cette commande ne peut s'executer que dans un salon de faction.");
};

module.exports.help = {
    name: "coffre",
    aliases: ['coffre', 'coffre de faction'],
    category: "economie",
    desription: "Affiche le contenu du coffre de faction.",
    usage: "",
    cooldown: 3,
    permissions: false,
    args: false
};