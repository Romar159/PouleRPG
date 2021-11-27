const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {
    if(isNaN(args[1]) || args[1] < 1) return message.reply("vous devez définir un nombre valide.");
    if(!message.mentions.users.first()) return message.reply("vous devez spécifier un utilisateur.");
    if(dbUser.or < parseInt(args[1])) return message.reply("vous n'avez pas assez d'argent dans votre banque pour en donner autant.");

    const mention = message.guild.members.cache.get(message.mentions.users.first().id);
    const embed = new MessageEmbed()
    .setColor('5E6366')
    .setAuthor(`Virement effectué`, message.author.displayAvatarURL())
    .setDescription(`:money_with_wings: ${message.author} a envoyé **${args[1]} or** à ${mention}.`)

    message.channel.send({embeds:[embed]});

    await client.setOr(client, message.member, - parseInt(args[1]), message);
    await client.setOr(client, mention, parseInt(args[1]), message);

    // ? Ici peut être améliorer les relation diplomatiques en ajoutant des points d'amitié si c'est entre deux factions différentes ?
};

module.exports.help = {
    name: "virement",
    aliases: [],
    category: "economie",
    desription: "Envoie de l'argent à un utilisateur.",
    usage: "<@user> <or>",
    cooldown: 3,
    permissions: false,
    args: true
};