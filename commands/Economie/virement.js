const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {
    if(isNaN(args[1]) || args[1] == 0) return message.reply("Vous devez définir un nombre valide.");
    if(!message.mentions.users.first()) return message.reply("Vous devez spécifier un utilisateur.");
    if(dbUser.or < parseInt(args[1])) return message.reply("Vous n'avez pas assez d'argent dans votre banque pour en donner autant.");

    const mention = message.guild.member(message.mentions.users.first());

    message.channel.send(`${message.author} a envoyé ${parseInt(args[1])} or à ${mention}.`);

    await client.setOr(client, message.member, - parseInt(args[1]), message);
    await client.setOr(client, mention, parseInt(args[1]), message);

    // ? Ici peut être améliorer les relation diplomatiques en ajoutant des points d'amitié si c'est entre deux factions différentes ?
};

module.exports.help = {
    name: "virement",
    aliases: ['virement'],
    category: "economie",
    desription: "Envoie de l'argent à un utilisateur.",
    usage: "<@user> <or>",
    cooldown: 3,
    permissions: false,
    args: true
};